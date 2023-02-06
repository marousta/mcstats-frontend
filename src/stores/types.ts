import type { mcStatus, PlayerData } from '../types';
import type { Api } from './api';
import type { ServerKind, ResponseServerInfos } from './websocket/types';

/**
 * Stores
 */

export interface ServerUptimeData {
	up: number;
	down: number;
}

export interface StorePlayers {
	[ServerKind.Vanilla]: PlayerData[] | null;
	[ServerKind.Modded]: PlayerData[] | null;
}

export interface StoreServerUptime {
	[ServerKind.Vanilla]: ServerUptimeData[] | null;
	[ServerKind.Modded]: ServerUptimeData[] | null;
}

export interface StorePlayersMaxOnline {
	[ServerKind.Vanilla]: ResponseHistoryPlayersMaxOnline[] | null;
	[ServerKind.Modded]: ResponseHistoryPlayersMaxOnline[] | null;
}

export interface StorePlayersLogtimes {
	[ServerKind.Vanilla]: ResponseHistoryPlayersLogtimes[] | null;
	[ServerKind.Modded]: ResponseHistoryPlayersLogtimes[] | null;
}

export interface StoreMcConnectionStatus {
	[ServerKind.Vanilla]: mcStatus;
	[ServerKind.Modded]: mcStatus;
}

export interface StoreMcVersion {
	[ServerKind.Vanilla]: ResponseServerInfos;
	[ServerKind.Modded]: ResponseServerInfos;
}

export interface StoreFetcher {
	[ServerKind.Vanilla]: Api | null;
	[ServerKind.Modded]: Api | null;
}

/**
 * Endpoints
 */

export interface ResponseHistoryServerUptime {
	up: number;
	down: number;
}

export interface ResponseHistoryPlayersMaxOnline {
	date: Date;
	value: number;
}

export interface HistoryPlayersLogtimes {
	date: Date;
	value: number;
}

export interface ResponseHistoryPlayersLogtimes {
	username: string;
	data: HistoryPlayersLogtimes[];
	current: number;
}
