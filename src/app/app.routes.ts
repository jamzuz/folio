import { Routes } from '@angular/router';
import { FrontPageComponent } from './front-page/front-page.component';
import { CharacterComponent } from './character/character.component';

export const routes: Routes = [
    { path: '', component: FrontPageComponent },
    { path: 'character', component: CharacterComponent }
];
