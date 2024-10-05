import { Routes } from '@angular/router';
import { FrontPageComponent } from './front-page/front-page.component';
import { CharacterComponent } from './character/character.component';
import { GameComponent } from './game/game.component';
import { routeGuard } from './guards/route.guard';

export const routes: Routes = [
    { path: '', component: FrontPageComponent },
    { path: 'character', component: CharacterComponent },
    { path: 'game', component: GameComponent, canActivate: [routeGuard] },
    { path: '**', component: FrontPageComponent }
];
