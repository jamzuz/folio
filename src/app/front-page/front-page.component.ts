import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Router, RouterLink } from '@angular/router';
import { OllamaService } from '../services/ollama.service';


@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css',
})
export class FrontPageComponent {

  constructor(private llama: OllamaService, private router: Router) {
    if (this.llama.hasLocalStorage()) {
      this.router.navigate(['/game'])
    }
  }

}
