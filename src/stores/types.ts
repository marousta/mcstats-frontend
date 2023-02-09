import type { Api } from './api';
import type { ServerKind, ResponseServerInfos } from './websocket/types';

/**
 * Stores
 */

import { getTime } from '../lib/time';

export type DataEntry = {
	data: number;
	label: string;
};

export function unfoldEntries(entries: DataEntry[]): [string[], number[]] {
	const labels: string[] = [];
	const data: number[] = [];
	for (const entry of entries) {
		data.push(entry.data);
		labels.push(new getTime(parseInt(entry.label)).full());
	}
	return [labels, data];
}

export enum wsStatus {
	Connected = 0,
	NotConnected = 1,
	Connecting = 2,
}

export enum mcStatus {
	NotConnected = 0,
	Connected = 1,
}

/**
 * Reworked
 */

export interface ServerUptimeData {
	up: number;
	down: number;
}

export interface PlayersCurrentlyOnline {
	uuid: string;
	username: string;
}

export interface StoreInit {
	[ServerKind.Vanilla]: boolean;
	[ServerKind.Modded]: boolean;
}

export interface StorePlayers {
	[ServerKind.Vanilla]: PlayersCurrentlyOnline[];
	[ServerKind.Modded]: PlayersCurrentlyOnline[];
}

export interface StoreServerUptime {
	[ServerKind.Vanilla]: ServerUptimeData[];
	[ServerKind.Modded]: ServerUptimeData[];
}

export interface StorePlayersMaxOnline {
	[ServerKind.Vanilla]: ResponseHistoryPlayersMaxOnline[];
	[ServerKind.Modded]: ResponseHistoryPlayersMaxOnline[];
}

export interface StorePlayersLogtimes {
	[ServerKind.Vanilla]: ResponseHistoryPlayersLogtimes[];
	[ServerKind.Modded]: ResponseHistoryPlayersLogtimes[];
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
