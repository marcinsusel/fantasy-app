import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private players: Player[] = [
        { id: 1, name: 'Alisson', position: 'GK', team: 'Liverpool', cost: 5.5 },
        { id: 2, name: 'Ederson', position: 'GK', team: 'Man City', cost: 5.5 },
        { id: 3, name: 'Pickford', position: 'GK', team: 'Everton', cost: 4.5 },
        { id: 4, name: 'Raya', position: 'GK', team: 'Arsenal', cost: 5.0 },
        { id: 5, name: 'Trippier', position: 'DEF', team: 'Newcastle', cost: 6.0 },
        { id: 6, name: 'White', position: 'DEF', team: 'Arsenal', cost: 6.0 },
        { id: 7, name: 'Saliba', position: 'DEF', team: 'Arsenal', cost: 5.5 },
        { id: 8, name: 'Van Dijk', position: 'DEF', team: 'Liverpool', cost: 6.5 },
        { id: 9, name: 'Stones', position: 'DEF', team: 'Man City', cost: 5.5 },
        { id: 10, name: 'Alexander-Arnold', position: 'DEF', team: 'Liverpool', cost: 7.0 },
        { id: 11, name: 'De Bruyne', position: 'MID', team: 'Man City', cost: 9.5 },
        { id: 12, name: 'Salah', position: 'MID', team: 'Liverpool', cost: 12.5 },
        { id: 13, name: 'Saka', position: 'MID', team: 'Arsenal', cost: 10.0 },
        { id: 14, name: 'Odegaard', position: 'MID', team: 'Arsenal', cost: 8.5 },
        { id: 15, name: 'Bruno Fernandes', position: 'MID', team: 'Man Utd', cost: 8.5 },
        { id: 16, name: 'Rodri', position: 'MID', team: 'Man City', cost: 6.5 },
        { id: 17, name: 'Haaland', position: 'FWD', team: 'Man City', cost: 15.0 },
        { id: 18, name: 'Watkins', position: 'FWD', team: 'Aston Villa', cost: 9.0 },
        { id: 19, name: 'Isak', position: 'FWD', team: 'Newcastle', cost: 8.5 },
        { id: 20, name: 'Solanke', position: 'FWD', team: 'Spurs', cost: 7.5 },
        { id: 21, name: 'Son', position: 'MID', team: 'Spurs', cost: 9.5 },
        { id: 22, name: 'Palmer', position: 'MID', team: 'Chelsea', cost: 10.5 },
        { id: 23, name: 'Foden', position: 'MID', team: 'Man City', cost: 9.5 },
        { id: 24, name: 'Gabriel', position: 'DEF', team: 'Arsenal', cost: 6.0 },
        { id: 25, name: 'Martinez', position: 'GK', team: 'Aston Villa', cost: 5.0 },
        { id: 26, name: 'Porro', position: 'DEF', team: 'Spurs', cost: 5.5 },
        { id: 27, name: 'Gvardiol', position: 'DEF', team: 'Man City', cost: 6.0 },
        { id: 28, name: 'Luis Diaz', position: 'MID', team: 'Liverpool', cost: 7.5 },
        { id: 29, name: 'Gordon', position: 'MID', team: 'Newcastle', cost: 7.5 },
        { id: 30, name: 'Havertz', position: 'FWD', team: 'Arsenal', cost: 8.0 }
    ];

    getPlayers(): Observable<Player[]> {
        return of(this.players);
    }
}
