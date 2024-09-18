import { Injectable } from '@angular/core';
import { Ollama } from 'ollama';
import { BehaviorSubject, Observable } from 'rxjs';

export type llamaResponse = {
  response: string
  done: boolean
  context: Array<string>
}

@Injectable({
  providedIn: 'root'
})

export class OllamaService {
  llamaChat = new BehaviorSubject<string>('');
  firstMessage: boolean = true;
  ollama = new Ollama({ host: 'http://localhost:11434' })

  constructor() {
  }

  async talkToLlama(message: string) {
    const response = await this.ollama.chat({
      model: 'llama3.1',
      stream: true,
      messages: [{ role: 'user', content: message.toString() }]
    })
    for await (const part of response) {
      this.llamaChat.next(part.message.content)
    }
    this.llamaChat.next("")
  }

  getLlamaChat(): Observable<string> {
    return this.llamaChat.asObservable()
  }
}
