import getTime from './lib/time';

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

export type InitReq = {
	type: 'init';
	version: IMcVersion;
	uptime: {
		sessions: Array<{ up: number; down: number }>;
	};
	players: TotalLogtime[];
	daily: Array<{ date: string; maxPlayers: number }>;
};

export type LogReq = {
	type: 'log';
	action: string;
	affected: string[];
};

export type uptimeReq = {
	type: 'uptime';
	state: boolean;
	timestamp: number;
};

export interface IMcVersion {
	java: string | null;
	bedrock: string | null;
}

export type McVersionReq = {
	type: 'version';
	java: string | null;
	bedrock: string | null;
};

export enum wsStatus {
	Connected,
	NotConnected,
	Connecting,
}

export enum mcStatus {
	Connected,
	NotConnected,
}

export type PlayerData = {
	username: string;
	id: number;
};

export type TotalLogtime = {
	username: string;
	data: Array<{ date: string; logtime: number }>;
	todayLogtime: number;
};
