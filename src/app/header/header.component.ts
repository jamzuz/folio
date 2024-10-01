import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OllamaService } from '../services/ollama.service';
import { NgIf } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private ollama: OllamaService, private router: Router) { }

  currentUrl(): string {
    return this.router.url
  }

  reset() {
    const alert = confirm("This will erase all chat logs and restart the whole process, continue?")
    if (alert == true) {
      this.ollama.clearLocalStorage()
    }
  }
}
