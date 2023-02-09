<script lang="ts">
	import PlayerHead from './PlayerHead.svelte';

	import { mcInfos, playersCurrentlyOnline, serverKind } from '../../stores/stores';
</script>

<div class="player-heads-text">
	Players Online <div class="countIndicator">
		{$playersCurrentlyOnline[$serverKind].length} / {$mcInfos[$serverKind].java.capacity}
	</div>
</div>
<div>
	<div class="player-heads">
		{#each $playersCurrentlyOnline[$serverKind] as player (player.uuid)}
			<PlayerHead {player} />
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
