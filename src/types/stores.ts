import type { Api } from '../stores/api';
import type { ResponseHistoryPlayersLogtimes } from './api';
import type {
	HistoryPlayersData,
	mcStatus,
	PlayersCurrentlyOnline,
	ServerKind,
	ServerUptimeData,
} from './global';
import type { ResponseServerInfos } from './ws';

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
	[ServerKind.Vanilla]: HistoryPlayersData[];
	[ServerKind.Modded]: HistoryPlayersData[];
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
