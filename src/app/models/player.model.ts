export interface Player {
    id: number;
    name: string;
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    team: string;
    cost: number;
    isSelected?: boolean;
}
