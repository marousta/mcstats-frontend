<script lang="ts">
	import type { PlayerData } from '../../types';
	import { mcInfos, players, serverKind } from '../../stores/stores';

	import PlayerHead from './PlayerHead.svelte';
	import { get } from 'svelte/store';
	import type { ResponseServerInfos } from '../../stores/websocket/types';
	import { onMount } from 'svelte';

	let mc_infos: ResponseServerInfos;
	mcInfos.subscribe((value) => {
		mc_infos = value[get(serverKind)];
	});

	let onlinePlayers: PlayerData[] = [];
	players.subscribe((value) => {
		onlinePlayers = value[get(serverKind)] ?? [];
	});

	onMount(() => {
		mc_infos = get(mcInfos)[get(serverKind)];
		onlinePlayers = get(players)[get(serverKind)] ?? [];
	});
</script>

<div class="player-heads-text">
	Players Online <div class="countIndicator">
		{onlinePlayers.length} / {mc_infos.java.capacity}
	</div>
</div>
<div>
	<div class="player-heads">
		{#each onlinePlayers as player (player.id)}
			<PlayerHead name={player.username} />
		{/each}
	</div>
</div>

<style lang="scss">
	.player-heads-text {
		width: 100%;
		display: flex;
		place-items: center;
		justify-content: center;
		font-size: 22px;
		height: 72px;

		.countIndicator {
			background-color: rgb(46, 46, 46);
			margin-left: 10px;
			padding: 8px;
			border-radius: 10px;
		}
	}
	.player-heads {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 34px;
		max-width: 800px;
	}

	@media screen and (max-width: 800px) {
		.player-heads {
			justify-content: center;
		}
	}
</style>
