import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export type llamaResponse = {
  response: string
  context: Array<string>
}

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
      "prompt": ""
    }
    body.prompt = message.toString()

    const t = await lastValueFrom(this.http.post<llamaResponse>('http://localhost:11434/api/generate', body))
    this.llamaChat = t.response
    console.log(t)
  }
}
