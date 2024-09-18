import { Component } from '@angular/core';
import { OllamaService } from '../services/ollama.service';
@Component({
  selector: 'app-front-page',
  standalone: true,
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})

export class FrontPageComponent {
  llamaSays: string = "";
  working: boolean = false;

  constructor(private llama: OllamaService) {
    this.llama.getLlamaChat().subscribe(llamaChat => {
      this.llamaSays = this.llamaSays + llamaChat
    })
  }

  sendMessage(message: string) {
    this.working = true
    this.llamaSays = ""
    this.llama.talkToLlama(message).finally(() => {
      this.working = false
    })
  }
}
