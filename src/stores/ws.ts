import { writable, type Writable } from 'svelte/store';
import { checkLocalDev } from '$lib/localDev';
import { PlayerData, wsStatus, mcStatus, IMcVersion, TotalLogtime, InitReq, LogReq, uptimeReq, McVersionReq } from '$types';

export const players: Writable<PlayerData[]> = writable([]);
export const uptime: Writable<{ up: number; down: number }[]> = writable([]);
export const daily: Writable<{ date: string; maxPlayers: number }[]> = writable([]);

export const wsConnectonStatus: Writable<wsStatus> = writable(wsStatus.Connecting);
export const refreshCountdown: Writable<number> = writable(0);

export const mcConnectionStatus: Writable<mcStatus> = writable(mcStatus.Connected);
export const mcVersion: Writable<IMcVersion | null> = writable(null);

let lStatus: wsStatus = wsStatus.Connecting;
let countdown: number;
let interval: any;

let nextID = 0;

const intervalSeconds: number = import.meta.env.VITE_WEBSOCKET_RELOAD_TIME;

wsConnectonStatus.subscribe((value) => {
	lStatus = value;
});

refreshCountdown.subscribe((value) => {
	countdown = value;
});

export const totalLogtime: Writable<TotalLogtime[]> = writable([]);

let lPlayers: PlayerData[] = [];

function onLogIn(player: string)
{
	console.log(player + ' logged in');
}

function onLogOut(player: string)
{
	console.log(player + ' logged out');
}

players.subscribe((value) => {
	const loggedOutPlayers = lPlayers.filter((x) => !value.includes(x));
	const loggedInPlayers = value.filter((x) => !lPlayers.includes(x));

	for (const player of loggedOutPlayers) {
		onLogOut(player.username);
	}
	for (const player of loggedInPlayers) {
		onLogIn(player.username);
	}

	lPlayers = value;
});

export const connect = () => {
	clearInterval(interval);
	wsConnectonStatus.set(wsStatus.Connecting);
	refreshCountdown.set(intervalSeconds);
	const address = checkLocalDev(import.meta.env.VITE_WEBSOCKET_ADDRESS, "wss://" + window.location.hostname + "/ws");
	if (!address) {
		console.error(
			`Environment variable 'VITE_WEBSOCKET_ADDRESS' is ${address}. Is your project set-up correctly ?`
		);
	}
	const ws = new WebSocket(address);

	setTimeout(() => {
		if (lStatus != wsStatus.Connected) {
			wsConnectonStatus.set(wsStatus.NotConnected);
			ws.close();
		}
	}, 2500);

	let ping_interval: NodeJS.Timer | undefined = undefined;

	ws.addEventListener('open', () => {
		wsConnectonStatus.set(wsStatus.Connected);
		ping_interval = setInterval(() => {
			ws.send("ping");
		}, 50000);
	});

	ws.addEventListener('message', (message: any) => {
		const data: InitReq | LogReq | uptimeReq | McVersionReq = JSON.parse(message.data);

		if (data.type == 'init') {
			uptime.set(data.uptime.sessions);
			daily.set(data.daily);
			totalLogtime.set(data.players);

			mcVersion.set({
				java: data.version.java,
				bedrock: data.version.bedrock,
			});

			if (data.uptime.sessions[data.uptime.sessions.length - 1].down != 0) {
				mcConnectionStatus.set(mcStatus.NotConnected);
			}
		} else if (data.type == 'log') {
			if (data.action == 'connect') {
				for (const player of data.affected) {
					if (!lPlayers.map((p) => p.username).includes(player)) {
						players.update((p) => [...p, { username: player, id: nextID++ }]);
					}
				}
			} else if (data.action == 'disconnect') {
				for (const player of data.affected) {
					players.update((p) =>
						p.filter(obj => obj.username !== player)
					);
				}
			}
		} else if (data.type == "uptime") {
			if (data.state) {
				mcConnectionStatus.set(mcStatus.Connected);
			} else {
				mcConnectionStatus.set(mcStatus.NotConnected);
			}
		} else if (data.type == "version") {
			mcVersion.set({
				java: data.java,
				bedrock: data.bedrock,
			});
		}
	});

	ws.addEventListener('close', () => {
		clearInterval(ping_interval);
		players.set([]);
		wsConnectonStatus.set(wsStatus.NotConnected);
		refreshCountdown.set(intervalSeconds);
		interval = setInterval(() => {
			refreshCountdown.update((n) => n - 1);
			if (countdown == 0) {
				clearInterval(interval);
				countdown = intervalSeconds;
				connect();
			}
		}, 1000);
	});
};
