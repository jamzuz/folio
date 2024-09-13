import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export type llamaResponse = {
  response : string
}


@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  
  llamaChat : string = "dafasdfsa";

  constructor(private http:HttpClient) { 
    
   }

  async talkToLlama(message:string){
    const body = {
      "stream": false,
      "model": "llama3.1",
      "prompt": message.toString()
    }
    const t = await lastValueFrom(this.http.post<llamaResponse>('http://localhost:11434/api/generate', body))
    this.llamaChat = t.response
  }
}
