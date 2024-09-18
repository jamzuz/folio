import { Injectable } from '@angular/core';
import { Ollama } from 'ollama';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  llamaChat = new BehaviorSubject<string>('');
  firstMessage: boolean = true;
  ollama = new Ollama({ host: 'http://localhost:11434' });

  assistantMessages: Array<{ role: string; content: string }> = [];

  constructor() {
    const context = this.getFromLocalStorage();
    this.assistantMessages = context;
  }

  async talkToLlama(message: string) {
    this.assistantMessages.push({ role: 'user', content: message });
    const response = await this.ollama.chat({
      model: 'llama3.1',
      stream: true,
      messages: this.assistantMessages,
    });
    for await (const part of response) {
      this.llamaChat.next(part.message.content);
      this.assistantMessages.push(part.message);
      this.pushToLocalStorage();
    }
    this.llamaChat.next('');
  }

  getLlamaChat(): Observable<string> {
    return this.llamaChat.asObservable();
  }

  pushToLocalStorage() {
    localStorage.setItem(
      'ollamaContext',
      JSON.stringify(this.assistantMessages)
    );
  }

  getFromLocalStorage() {
    const context = localStorage.getItem('ollamaContext');
    return context ? JSON.parse(context) : [];
  }
}
