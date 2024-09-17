import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export type llamaResponse = {
  response: string
  context: Array<string>
}

@Injectable({
  providedIn: 'root'
})

export class OllamaService {
  // beautiful debug is beautiful
  llamaChat: string = "dafasdfsa";
  firstMessage: boolean = true;

  constructor(private http: HttpClient) {

  }

  async talkToLlama(message: string) {

    const body = {
      "stream": false,
      "model": "llama3.1",
      "prompt": message.toString()
    }

    const post = await lastValueFrom(this.http.post<llamaResponse>('http://localhost:11434/api/generate', body))
    this.llamaChat = post.response
    console.log(post)
  }
}
