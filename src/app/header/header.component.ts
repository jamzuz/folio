import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OllamaService } from '../services/ollama.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private ollama: OllamaService){}
  reset(){
    const alert = confirm("This will erase all chat logs and restart the whole process, continue?")
    if (alert == true){
      this.ollama.clearLocalStorage()
    }
  }
}
