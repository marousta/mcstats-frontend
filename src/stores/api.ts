import { get } from 'svelte/store';

import {
	playersMaxOnline,
	fetcher,
	mcConnectionStatus,
	mcInfos,
	playersLogtimes,
	serverUptime,
	playersCurrentlyOnline,
	playersCurrentlyOnlineInit,
	playersLogtimesInit,
	playersMaxOnlineInit,
	serverUptimeInit,
} from './stores';

import { mcStatus, ServerKind, type HistoryPlayersData } from '../types/global';
import type { ResponseHistoryPlayersLogtimes, ResponseHistoryServerUptime } from '../types/api';
import type { ResponsePlayersCurrentlyOnline, ResponseServerInfos } from '../types/ws';

export class Api {
	private readonly kind: ServerKind;

	constructor(kind: ServerKind) {
		this.kind = kind;

		this.initData();
	}

	private async fetch(path: string) {
		return fetch(`${window.location.origin}/api/${this.kind}/${path}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})
			.then((r) => r.json())
			.catch((e) => {
				console.error(e);
				return null;
			});
	}

	async serverStatus(): Promise<boolean> {
		return this.fetch('server/status');
	}

	async serverInfos(): Promise<ResponseServerInfos> {
		return this.fetch('server/infos');
	}

	async playersOnline(): Promise<ResponsePlayersCurrentlyOnline[]> {
		return this.fetch('players/online');
	}

	async uptime(): Promise<ResponseHistoryServerUptime[]> {
		return this.fetch('charts/server/uptime');
	}

	async playersMax(): Promise<HistoryPlayersData[]> {
		return this.fetch('charts/players/max');
	}

	async playersLogtimesHistory(): Promise<ResponseHistoryPlayersLogtimes[]> {
		return this.fetch('charts/players/history');
	}

	async initData() {
		const status = await this.serverStatus();
		const version = await this.serverInfos();

		mcConnectionStatus.update((s) => {
			s[this.kind] = status ? mcStatus.Connected : mcStatus.NotConnected;
			return s;
		});

		mcInfos.update((v) => {
			v[this.kind] = version;
			return v;
		});
	}
}

export async function initFetchers() {
	let fetchers = get(fetcher);
	if (fetchers) {
		return fetchers;
	}

	let endpoints: string[] | null = await fetch(`${window.location.origin}/api/endpoints`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
	})
		.then((r) => r.json())
		.catch((e) => {
			console.error(e);
			return null;
		});

	if (!endpoints) {
		return null;
	}

	fetchers = {
		[ServerKind.Vanilla]: endpoints.includes(ServerKind.Vanilla)
			? new Api(ServerKind.Vanilla)
			: null,
		[ServerKind.Modded]: endpoints.includes(ServerKind.Modded)
			? new Api(ServerKind.Modded)
			: null,
	};
	if (!fetchers[ServerKind.Vanilla] && !fetchers[ServerKind.Modded]) {
		return null;
	}
	fetcher.set(fetchers);

	return fetchers;
}

export async function initHistoryLogtimes(kind: ServerKind) {
	if (get(playersLogtimesInit)[kind]) {
		return;
	}

	const f = await initFetchers();
	if (!f || !f[kind]) {
		throw new Error('Failed to get logtimes history, no fetcher');
	}

	const history = await f[kind]!.playersLogtimesHistory();
	if (!history) {
		throw new Error('Empty response');
	}

	playersLogtimes.update((value) => {
		value[kind] = history;
		return value;
	});
	playersLogtimesInit.update((value) => {
		value[kind] = true;
		return value;
	});
}

export async function initHistoryPlayersMaxOnline(kind: ServerKind) {
	if (get(playersMaxOnlineInit)[kind]) {
		return;
	}

	const f = await initFetchers();
	if (!f || !f[kind]) {
		throw new Error('Failed to get players max online history, no fetcher');
	}

	const history = await f[kind]!.playersMax();
	if (!history) {
		throw new Error('Empty response');
	}

	playersMaxOnline.update((value) => {
		value[kind] = history;
		return value;
	});
	playersMaxOnlineInit.update((value) => {
		value[kind] = true;
		return value;
	});
}

export async function initHistoryServerUptime(kind: ServerKind) {
	if (get(serverUptimeInit)[kind]) {
		return;
	}

	const f = await initFetchers();
	if (!f || !f[kind]) {
		throw new Error('Failed to get server uptime history, no fetcher');
	}

	const uptime = await f[kind]!.uptime();
	if (!uptime) {
		throw new Error('Empty response');
	}

	serverUptime.update((value) => {
		value[kind] = uptime;
		return value;
	});
	serverUptimeInit.update((value) => {
		value[kind] = true;
		return value;
	});
}

export async function initPlayersCurrentlyOnline() {
	if (get(playersCurrentlyOnlineInit)) {
		return;
	}

	const fetchers = await initFetchers();
	if (!fetchers) {
		throw new Error('Failed to get players currently online, no fetcher');
	}

	const promises = [
		fetchers[ServerKind.Vanilla]?.playersOnline(),
		fetchers[ServerKind.Modded]?.playersOnline(),
	];

	const ret = await Promise.all(promises);

	playersCurrentlyOnline.set({
		[ServerKind.Vanilla]: ret[0] ?? [],
		[ServerKind.Modded]: ret[1] ?? [],
	});

	playersCurrentlyOnlineInit.set(true);
}
