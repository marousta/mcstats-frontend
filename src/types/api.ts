import type { HistoryPlayersData } from './global';

export interface ResponseHistoryServerUptime {
	up: number;
	down: number;
}

export interface ResponseHistoryPlayersLogtimes {
	username: string;
	data: HistoryPlayersData[];
	current: number;
}
