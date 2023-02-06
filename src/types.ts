import { getTime } from './lib/time';

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

export type PlayerData = {
	username: string;
	id: number; //TODO: UUID
};

/**
 * Reworked
 */
