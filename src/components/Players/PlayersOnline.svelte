<script lang="ts">
	import PlayerData from './PlayerData.svelte';

	import { mcConnectionStatus, serverKind, wsConnectonStatus } from '../../stores/stores';
	import wsConnect from '../../stores/ws';

	import { mcStatus, wsStatus } from '../../types/global';

	function keydown(e: KeyboardEvent) {
		if (e.key == 'Enter') wsConnect();
	}
</script>

<div class="player-heads-container">
	{#if $mcConnectionStatus[$serverKind] == mcStatus.NotConnected}
		<div class="server-closed status">Server is closed.</div>
	{:else if $wsConnectonStatus == wsStatus.Connected}
		<PlayerData />
	{:else if $wsConnectonStatus == wsStatus.Connecting}
		<div class="loading status">Loading...</div>
	{:else if $wsConnectonStatus == wsStatus.NotConnected}
		<div class="server-closed status">Unable to get data from server.</div>
		<div class="status">Retrying...</div>
		<div class="refreshButton" on:click={wsConnect} on:keydown={keydown}>Refresh</div>
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
