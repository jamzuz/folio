import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';


@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css',
})
export class FrontPageComponent {

  constructor(private localStorageService: LocalStorageService, private router: Router) {
    if (this.localStorageService.hasLocalStorage()) {
      this.router.navigate(['/game'])
    } else {
      this.router.navigate(['/'])
    }
  }

}
