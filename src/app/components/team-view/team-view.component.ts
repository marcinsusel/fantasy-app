import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-team-view',
  standalone: true,
  imports: [CommonModule, PlayerCardComponent, FormsModule],
  templateUrl: './team-view.component.html',
  styleUrl: './team-view.component.css'
})
export class TeamViewComponent {
  teamService = inject(TeamService);

  saveStatus = signal<string>('');
  loadId = signal<string>('');

  // Computed properties for grouping players on the pitch
  goalkeepers = computed(() =>
    this.teamService.selectedPlayers().filter(p => p.position === 'GK')
  );

  defenders = computed(() =>
    this.teamService.selectedPlayers().filter(p => p.position === 'DEF')
  );

  midfielders = computed(() =>
    this.teamService.selectedPlayers().filter(p => p.position === 'MID')
  );

  attackers = computed(() =>
    this.teamService.selectedPlayers().filter(p => p.position === 'FWD')
  );

  removePlayer(player: Player) {
    this.teamService.removePlayer(player.id);
  }

  saveTeam() {
    if (!this.teamService.isValidFormation()) {
      this.saveStatus.set('Error: Invalid formation');
      setTimeout(() => this.saveStatus.set(''), 3000);
      return;
    }

    this.saveStatus.set('Saving...');
    this.teamService.saveSquad().subscribe({
      next: (res) => {
        this.saveStatus.set(`Saved! ID: ${res.id}`);
      },
      error: (err) => {
        console.error(err);
        this.saveStatus.set('Error saving team');
      }
    });
  }

  loadTeam() {
    if (!this.loadId()) return;

    this.saveStatus.set('Loading...');
    this.teamService.loadSquad(this.loadId()).subscribe({
      next: () => {
        this.saveStatus.set('Team loaded successfully');
        setTimeout(() => this.saveStatus.set(''), 3000);
      },
      error: (err) => {
        console.error(err);
        this.saveStatus.set('Error loading team (Invalid ID?)');
      }
    });
  }
}
