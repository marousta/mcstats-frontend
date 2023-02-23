/**
 * Enums
 */

export enum ServerKind {
	Vanilla = 'vanilla',
	Modded = 'modded',
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
 * Types
 */

export interface ServerInfos {
	version: string;
	capacity: number;
	motd: string;
}

export interface ServerUptimeData {
	up: number;
	down: number;
}

export interface PlayersCurrentlyOnline {
	uuid: string;
	username: string;
}

export interface HistoryPlayersData {
	date: string;
	value: number;
}

/**
 * Charts
 */

export interface DataEntry {
	data: number;
	label: string;
}
