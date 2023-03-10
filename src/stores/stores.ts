import type ReconnectingWebSocket from 'reconnecting-websocket';
import { writable, type Writable } from 'svelte/store';

import type {
	StoreFetcher,
	StoreInit,
	StoreMcConnectionStatus,
	StoreMcVersion,
	StorePlayers,
	StorePlayersLogtimes,
	StorePlayersMaxOnline,
	StoreServerUptime,
} from '../types/stores';
import { mcStatus, wsStatus } from '../types/global';
import { ServerKind } from '../types/global';

export const playersCurrentlyOnlineInit: Writable<boolean> = writable(false);
export const playersCurrentlyOnline: Writable<StorePlayers> = writable({
	[ServerKind.Vanilla]: [],
	[ServerKind.Modded]: [],
});

export const serverUptimeInit: Writable<StoreInit> = writable({
	[ServerKind.Vanilla]: false,
	[ServerKind.Modded]: false,
});
export const serverUptime: Writable<StoreServerUptime> = writable({
	[ServerKind.Vanilla]: [],
	[ServerKind.Modded]: [],
});

export const playersMaxOnlineInit: Writable<StoreInit> = writable({
	[ServerKind.Vanilla]: false,
	[ServerKind.Modded]: false,
});
export const playersMaxOnline: Writable<StorePlayersMaxOnline> = writable({
	[ServerKind.Vanilla]: [],
	[ServerKind.Modded]: [],
});

export const playersLogtimesInit: Writable<StoreInit> = writable({
	[ServerKind.Vanilla]: false,
	[ServerKind.Modded]: false,
});
export const playersLogtimes: Writable<StorePlayersLogtimes> = writable({
	[ServerKind.Vanilla]: [],
	[ServerKind.Modded]: [],
});

export const ws: Writable<ReconnectingWebSocket | null> = writable(null);
export const wsConnectonStatus: Writable<wsStatus> = writable(wsStatus.Connecting);

export const mcConnectionStatus: Writable<StoreMcConnectionStatus> = writable({
	[ServerKind.Vanilla]: mcStatus.NotConnected,
	[ServerKind.Modded]: mcStatus.NotConnected,
});
export const mcInfos: Writable<StoreMcVersion> = writable({
	[ServerKind.Vanilla]: { java: { version: 'Error', capacity: -1, motd: '' }, bedrock: null },
	[ServerKind.Modded]: { java: { version: 'Error', capacity: -1, motd: '' }, bedrock: null },
});

export const serverKind: Writable<ServerKind> = writable(ServerKind.Vanilla);
export const pageStatus: Writable<number> = writable(200);

export const fetcher: Writable<StoreFetcher | null> = writable(null);
