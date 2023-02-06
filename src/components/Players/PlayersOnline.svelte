<script lang="ts">
	import { mcConnectionStatus, refreshCountdown, wsConnectonStatus } from '../../stores/stores';
	import { ServerKind } from '../../stores/websocket/types';
	import { mcStatus, wsStatus } from '../../types';
	import wsConnect from '../../stores/websocket/ws';

	import PlayerData from './PlayerData.svelte';

	let ws_status: wsStatus;
	let countdown: number;

	let mc_status: mcStatus;
	wsConnectonStatus.subscribe((value) => {
		ws_status = value;
	});

	refreshCountdown.subscribe((value) => {
		countdown = value;
	});

	mcConnectionStatus.subscribe((value) => {
		mc_status = value[ServerKind.Modded];
	});

	function keydown(e: KeyboardEvent) {
		if (e.key == 'Enter') wsConnect();
	}
</script>

<div class="player-heads-container">
	{#if ws_status == wsStatus.Connected}
		<PlayerData />
	{:else if ws_status == wsStatus.Connecting}
		<div class="loading status">Loading...</div>
	{:else if ws_status == wsStatus.NotConnected}
		<div class="server-closed status">Unable to get data from server.</div>
		<div class="status">Retrying in {countdown}s</div>
		<div class="refreshButton" on:click={wsConnect} on:keydown={keydown}>Refresh</div>
	{:else if mc_status == mcStatus.NotConnected}
		<div class="server-closed status">Server is closed.</div>
	{/if}
</div>

<style lang="scss">
	.player-heads-container {
		display: grid;
		place-items: center;
	}

	.status {
		padding-top: 30px;
		font-size: 20px;
	}

	.refreshButton {
		user-select: none;
		background: rgb(68, 68, 68);
		padding: 4px 10px 4px 10px;
		margin: 15px;
		border-radius: 4px;
		cursor: pointer;

		&:hover {
			background: rgb(90, 90, 90);
		}
	}

	.server-closed {
		color: rgb(233, 0, 0);
		border: none;
	}
</style>
