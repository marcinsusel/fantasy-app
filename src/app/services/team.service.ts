import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    // Using signals for modern Angular state management
    readonly selectedPlayers = signal<Player[]>([]);

    readonly totalPlayers = computed(() => this.selectedPlayers().length);

    readonly goalkeeperCount = computed(() =>
        this.selectedPlayers().filter(p => p.position === 'GK').length
    );

    readonly defenderCount = computed(() =>
        this.selectedPlayers().filter(p => p.position === 'DEF').length
    );

    readonly midfielderCount = computed(() =>
        this.selectedPlayers().filter(p => p.position === 'MID').length
    );

    readonly attackerCount = computed(() =>
        this.selectedPlayers().filter(p => p.position === 'FWD').length
    );

    readonly isValidFormation = computed(() => {
        const gk = this.goalkeeperCount();
        const def = this.defenderCount();
        const mid = this.midfielderCount();
        const fwd = this.attackerCount();
        const total = this.totalPlayers();

        return total === 11 &&
            gk === 1 &&
            def >= 3 && def <= 5 &&
            mid >= 4 && mid <= 5 &&
            fwd >= 3 && fwd <= 4;
    });

    readonly currentCost = computed(() =>
        this.selectedPlayers().reduce((acc, p) => acc + p.cost, 0)
    );

    readonly formationError = computed(() => {
        const gk = this.goalkeeperCount();
        const def = this.defenderCount();
        const mid = this.midfielderCount();
        const fwd = this.attackerCount();
        const total = this.totalPlayers();

        if (total > 11) return 'Too many players selected (Max 11)';
        if (gk > 1) return 'Only 1 Goalkeeper allowed';
        if (def > 5) return 'Max 5 Defenders allowed';
        if (mid > 5) return 'Max 5 Midfielders allowed';
        if (fwd > 4) return 'Max 4 Attackers allowed';

        return null; // No immediate adding error, but might be incomplete
    });

    addPlayer(player: Player): void {
        const currentList = this.selectedPlayers();

        // Check if already selected
        if (currentList.some(p => p.id === player.id)) {
            return; // Already selected
        }

        // Check specific positional constraints before adding
        if (player.position === 'GK' && this.goalkeeperCount() >= 1) {
            alert('You can only select 1 Goalkeeper');
            return;
        }
        if (player.position === 'DEF' && this.defenderCount() >= 5) {
            alert('You can only select up to 5 Defenders');
            return;
        }
        if (player.position === 'MID' && this.midfielderCount() >= 5) {
            alert('You can only select up to 5 Midfielders');
            return;
        }
        if (player.position === 'FWD' && this.attackerCount() >= 4) {
            alert('You can only select up to 4 Attackers');
            return;
        }
        if (this.totalPlayers() >= 11) {
            alert('You have already selected 11 players');
            return;
        }

        this.selectedPlayers.update(players => [...players, { ...player, isSelected: true }]);
    }

    removePlayer(playerId: number): void {
        this.selectedPlayers.update(players => players.filter(p => p.id !== playerId));
    }

    // Backend Integration
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/squads';

    saveSquad(): Observable<{ id: string }> {
        const players = this.selectedPlayers();
        return this.http.post<{ id: string }>(this.apiUrl, players);
    }

    loadSquad(id: string): Observable<object> {
        return this.http.get<Player[]>(`${this.apiUrl}/${id}`).pipe(
            tap(players => {
                // Transform to match local state if needed, or just set it
                // We need to mark them as selected
                const selected = players.map(p => ({ ...p, isSelected: true }));
                this.selectedPlayers.set(selected);
            })
        );
    }
}
