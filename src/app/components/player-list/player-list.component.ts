import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerCardComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css'
})
export class PlayerListComponent {
  private playerService = inject(PlayerService);
  private teamService = inject(TeamService);

  players = signal<Player[]>([]);

  // Filters
  searchTerm = signal('');
  positionFilter = signal<string>('');

  // Computed filtered list
  filteredPlayers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const pos = this.positionFilter();

    return this.players().filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(term) || p.team.toLowerCase().includes(term);
      const matchesPosition = pos ? p.position === pos : true;
      return matchesSearch && matchesPosition;
    });
  });

  // Track selected IDs to disable buttons
  selectedPlayerIds = computed(() =>
    new Set(this.teamService.selectedPlayers().map(p => p.id))
  );

  constructor() {
    this.playerService.getPlayers().subscribe(data => {
      this.players.set(data);
    });
  }

  addPlayer(player: Player) {
    this.teamService.addPlayer(player);
  }

  isPlayerSelected(player: Player): boolean {
    return this.selectedPlayerIds().has(player.id);
  }
}
