import { Component } from '@angular/core';
import { OllamaService } from '../services/ollama.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})

export class FrontPageComponent {
  llamaSays: string = "";
  message: string = ""
  working: boolean = false;

  constructor(private llama: OllamaService) {
    this.llama.getLlamaChat().subscribe(llamaChat => {
      this.llamaSays = this.llamaSays + llamaChat
    })
  }

  sendMessage() {
    this.working = true
    // this.llamaSays = ""
    // push to old array ^
    this.llama.talkToLlama(this.message)
      .then(() => {
        this.message = ""
      })
      .finally(() => {
        this.llamaSays = this.llamaSays + "  "
        this.working = false
      })
  }
}
