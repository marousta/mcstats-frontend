<script lang="ts">
	import {
		connect,
		wsConnectonStatus,
		mcConnectionStatus,
		mcVersion,
		refreshCountdown
	} from '../../stores/ws';
	import { wsStatus, mcStatus, type IMcVersion } from '../../types';
	import PlayerData from '../../components/Player/PlayerData.svelte';
	import { server_name } from '../../stores/server_properties';

	let ws_status: wsStatus;
	let countdown: number;

	let mc_status: mcStatus;
	let mc_version: IMcVersion | null = null;

	wsConnectonStatus.subscribe((value) => {
		ws_status = value;
	});

	refreshCountdown.subscribe((value) => {
		countdown = value;
	});

	mcConnectionStatus.subscribe((value) => {
		mc_status = value;
	});

	mcVersion.subscribe((value: IMcVersion | null) => {
		mc_version = value;
	});

	function keydown(e: KeyboardEvent) {
		if (e.key == 'Enter') connect();
	}
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

<div class="disclaimer">
	Compatible with Minecraft <b>Java Edition</b>
	{#if mc_version && mc_version.java}
		<b>{mc_version.java}</b>
	{/if}
	and <b title="kinda">Bedrock Edition</b>
	{#if mc_version && mc_version.bedrock}
		<b>{mc_version.bedrock}</b>
	{/if}
</div>
<div class="tips">
	<p>
		I highly recommend you to play <b>Minecraft Java Edition</b> with
		<a class="link" href="https://github.com/CaffeineMC/sodium-fabric" target="_blank">Sodium</a> for
		maximum performance
	</p>
</div>

<div class="player-heads-container">
	{#if ws_status == wsStatus.Connected}
		<PlayerData maxPlayers="60" />
	{:else if ws_status == wsStatus.Connecting}
		<div class="loading status">Loading...</div>
	{:else if ws_status == wsStatus.NotConnected}
		<div class="server-closed status">Unable to get data from server.</div>
		<div class="status">Retrying in {countdown}s</div>
		<div class="refreshButton" on:click={connect} on:keydown={keydown}>Refresh</div>
	{/if}
	{#if mc_status == mcStatus.NotConnected}
		<div class="server-closed status">Server is closed.</div>
	{/if}
</div>

<style lang="scss">
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

	.status {
		padding-top: 30px;
		font-size: 20px;
	}

	.disclaimer {
		padding-top: 40px;
		font-size: 20px;
		text-align: center;
	}

	.tips {
		padding-top: 20px;
		font-size: 20px;
		text-align: center;
	}

	.link {
		text-decoration: underline;
		font-weight: bold;

		&.alt:hover::after {
			content: '(always up to date)';
			position: absolute;
			text-decoration: none;
			font-weight: lighter;
			margin-left: 5px;
			margin-top: 4px;
			font-size: 15px;
		}
	}

	@media screen and (max-width: 910px) {
		.link.alt:hover::after {
			display: none;
		}
	}

	.player-heads-container {
		display: grid;
		place-items: center;
	}
</style>
