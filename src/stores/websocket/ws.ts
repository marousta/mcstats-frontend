import ReconnectingWebSocket from 'reconnecting-websocket';

import {
	mcConnectionStatus,
	mcInfos,
	playersCurrentlyOnline,
	playersCurrentlyOnlineInit,
	ws,
	wsConnectonStatus,
} from '../stores';

import { wsStatus, mcStatus } from '../types';
import {
	WebsocketNamespace,
	WebsocketServerEvent,
	WebsocketPlayersEvent,
	type WebsocketPlayersChange,
	type WebsocketServerStatus,
	type WebsocketServerVersion,
} from './types';
import { get } from 'svelte/store';
import { ServerKind } from './types';
import { initPlayersCurrentlyOnline } from '../api';

const intervalSeconds: number = 5;

export default async function () {
	if (get(ws) !== null) {
		return;
	}

	wsConnectonStatus.set(wsStatus.Connecting);

	const wss = new ReconnectingWebSocket(
		'wss://' + window.location.hostname + '/api/streaming',
		'wss',
		{
			minReconnectionDelay: intervalSeconds * 1000,
		},
	);

	let ping_interval: NodeJS.Timer;

	wss.onopen = async () => {
		ws.set(wss);
		wsConnectonStatus.set(wsStatus.Connected);

		await initPlayersCurrentlyOnline();

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
					case WebsocketServerEvent.Infos:
						mcInfos.update((infos) => {
							infos[data.server.kind] = {
								java: data.server.version.java,
								bedrock: data.server.version.bedrock,
							};
							return infos;
						});
						return;
				}
			case WebsocketNamespace.Players:
				switch (data.event) {
					case WebsocketPlayersEvent.Change:
						playersCurrentlyOnline.update((p) => {
							p[data.server.kind] = data.players;
							return p;
						});
						return;
				}
		}
	};

	wss.onerror = () => {};

	wss.onclose = () => {
		ws.set(null);
		clearInterval(ping_interval);

		playersCurrentlyOnline.set({
			[ServerKind.Vanilla]: [],
			[ServerKind.Modded]: [],
		});
		playersCurrentlyOnlineInit.set(false);

		wsConnectonStatus.set(wsStatus.NotConnected);
	};
}
