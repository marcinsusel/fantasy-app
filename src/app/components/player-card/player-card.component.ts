import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  @Input({ required: true }) player!: Player;
  @Input() actionLabel: string = 'Add';
  @Input() actionType: 'add' | 'remove' = 'add';
  @Input() disabled: boolean = false;

  @Output() action = new EventEmitter<Player>();

  onAction() {
    if (!this.disabled) {
      this.action.emit(this.player);
    }
  }

  getPositionColor(position: string): string {
    switch (position) {
      case 'GK': return '#eab308'; // Yellow
      case 'DEF': return '#3b82f6'; // Blue
      case 'MID': return '#22c55e'; // Green
      case 'FWD': return '#ef4444'; // Red
      default: return '#9ca3af';
    }
  }
}
