import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { TeamViewComponent } from './components/team-view/team-view.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, PlayerListComponent, TeamViewComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'fantasy-football-app';
}
