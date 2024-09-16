import { Component } from '@angular/core';
import { OllamaService } from '../ollama.service';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})

export class FrontPageComponent {
  llamaSays: string = "Hello!";
  working: boolean = false;
  constructor(private llama: OllamaService) { }

  ding(message: string) {
    this.working = true
    this.llama.talkToLlama(message).finally(() =>  {
      this.llamaSays = this.llama.llamaChat
      this.working = false
    })
  }
}
