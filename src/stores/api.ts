import { get } from 'svelte/store';
import { mcStatus } from '../types';
import {
	playersMaxOnline,
	fetcher,
	mcConnectionStatus,
	mcInfos,
	playersLogtimes,
	serverUptime,
} from './stores';
import type {
	ResponseHistoryPlayersLogtimes,
	ResponseHistoryPlayersMaxOnline,
	ResponseHistoryServerUptime,
} from './types';
import { ServerKind, type ResponseServerInfos } from './websocket/types';

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
				console.log(e);
				return null;
			});
	}

	async serverStatus(): Promise<boolean> {
		return this.fetch('server/status');
	}

	async serverVersion(): Promise<ResponseServerInfos> {
		return this.fetch('server/version');
	}

	async playersOnline(): Promise<string[]> {
		return this.fetch('players/online');
	}

	async uptime(): Promise<ResponseHistoryServerUptime[]> {
		return this.fetch('charts/server/uptime');
	}

	async playersMax(): Promise<ResponseHistoryPlayersMaxOnline[]> {
		return this.fetch('charts/players/max');
	}

	async playersLogtimesHistory(): Promise<ResponseHistoryPlayersLogtimes[]> {
		return this.fetch('charts/players/history');
	}

	async initData() {
		const status = await this.serverStatus();
		const version = await this.serverVersion();

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

	const endpoints: string[] | null = await fetch(`${window.location.origin}/api/endpoints`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
	})
		.then((r) => r.json())
		.catch((e) => {
			console.log(e);
			return null;
		});

	if (!endpoints) {
		throw new Error('No endpoints');
	}

	fetchers = {
		[ServerKind.Vanilla]: endpoints.includes(ServerKind.Vanilla)
			? new Api(ServerKind.Vanilla)
			: null,
		[ServerKind.Modded]: endpoints.includes(ServerKind.Modded)
			? new Api(ServerKind.Modded)
			: null,
	};
	fetcher.set(fetchers);

	return fetchers;
}

export async function initHistoryLogtimes(kind: ServerKind) {
	if (get(playersLogtimes)[kind]) {
		console.log('already init ' + kind);
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
}

export async function initHistoryPlayersMaxOnline(kind: ServerKind) {
	if (get(playersMaxOnline)[kind]) {
		console.log('already init ' + kind);
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
}

export async function initHistoryServerUptime(kind: ServerKind) {
	if (get(serverUptime)[kind]) {
		console.log('already init ' + kind);
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
}
