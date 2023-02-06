import ReconnectingWebSocket from 'reconnecting-websocket';

import {
	mcConnectionStatus,
	mcInfos,
	players,
	refreshCountdown,
	ws,
	wsConnectonStatus,
} from '../stores';

import type { PlayerData } from '../../types';
import { wsStatus, mcStatus } from '../../types';
import {
	WebsocketNamespace,
	WebsocketServerEvent,
	WebsocketPlayersEvent,
	type WebsocketPlayersChange,
	type WebsocketServerStatus,
	type WebsocketServerVersion,
} from './types';
import { get } from 'svelte/store';
import { fetcher } from '../stores';
import { ServerKind } from './types';

let lStatus: wsStatus = wsStatus.Connecting;
let countdown: number;
let interval: any;

let nextID = 0;

const intervalSeconds: number = 5;

wsConnectonStatus.subscribe((value) => {
	lStatus = value;
});

refreshCountdown.subscribe((value) => {
	countdown = value;
});

function mapPlayersOnline(username: string) {
	return {
		username,
		id: nextID++,
	};
}

export default async function () {
	if (get(ws) !== null) {
		return;
	}

	clearInterval(interval);
	wsConnectonStatus.set(wsStatus.Connecting);
	refreshCountdown.set(intervalSeconds);

	const wss = new ReconnectingWebSocket(
		'wss://' + window.location.hostname + '/api/streaming',
		'wss',
		{
			minReconnectionDelay: intervalSeconds,
		},
	); //FIXME: SPAM RECONNECT

	let ping_interval: NodeJS.Timer;

	wss.onopen = async () => {
		ws.set(wss);
		wsConnectonStatus.set(wsStatus.Connected);

		const fetchers = get(fetcher);
		if (fetchers) {
			const ret = [
				(await fetchers[ServerKind.Vanilla]?.playersOnline()) ?? null,
				(await fetchers[ServerKind.Modded]?.playersOnline()) ?? null,
			];

			const update: (PlayerData[] | null)[] = [
				ret[0]?.map(mapPlayersOnline) ?? null,
				ret[1]?.map(mapPlayersOnline) ?? null,
			];

			players.set({
				[ServerKind.Vanilla]: update[0],
				[ServerKind.Modded]: update[1],
			});
		}

		console.log('Connected');
		ping_interval = setInterval(() => {
			wss.send('ping');
		}, 50000);
	};

	wss.onmessage = (message: any) => {
		const data: WebsocketServerStatus | WebsocketServerVersion | WebsocketPlayersChange =
			JSON.parse(message.data);

		if (!data.namespace) {
			throw new Error(`Websocket has no namespace`);
		}

		switch (data.namespace) {
			case WebsocketNamespace.Server:
				switch (data.event) {
					case WebsocketServerEvent.Status:
						mcConnectionStatus.update((status) => {
							status[data.server.kind] = data.server.status
								? mcStatus.Connected
								: mcStatus.NotConnected;
							return status;
						});
						return;
					case WebsocketServerEvent.Version:
						mcInfos.update((version) => {
							version[data.server.kind] = {
								java: data.server.version.java,
								bedrock: data.server.version.bedrock,
							};
							return version;
						});
						return;
				}
			case WebsocketNamespace.Players:
				switch (data.event) {
					case WebsocketPlayersEvent.Change:
						const update: PlayerData[] = data.players.usernames.map(mapPlayersOnline);

						players.update((p) => {
							p[data.server.kind] = update;
							return p;
						});
						return;
				}
		}
		return;

		// if (data.type == 'init') {
		// 	uptime.set(data.uptime.sessions);
		// 	daily.set(data.daily);
		// 	totalLogtime.set(data.players);
		// }
	};

	wss.onerror = () => {};

	wss.onclose = () => {
		clearInterval(ping_interval);
		players.set({
			[ServerKind.Vanilla]: null,
			[ServerKind.Modded]: null,
		});
		wsConnectonStatus.set(wsStatus.NotConnected);
		refreshCountdown.set(intervalSeconds);

		interval = setInterval(() => {
			refreshCountdown.update((n) => {
				let v = n - 1;
				if (v < 0 || isNaN(v)) {
					v = 0;
				}
				return v;
			});
			if (countdown == 0) {
				clearInterval(interval);
				countdown = intervalSeconds;
			}
		}, 1000);
	};
}
