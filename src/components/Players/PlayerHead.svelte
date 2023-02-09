<script lang="ts">
	import type { ResponsePlayersCurrentlyOnline } from '../../stores/websocket/types';

	export let player: ResponsePlayersCurrentlyOnline;

	function getHead() {
		const shrink = player.uuid.replaceAll('-', '');
		return player.username.charAt(0) === '.'
			? '/heads/Steve.png'
			: 'https://crafthead.net/avatar/' + shrink;
	}
</script>

<div class="player-head">
	<div
		class="player-head-img"
		style="background-image: url('{getHead()}'); color: white; background-size: 100%; image-rendering: pixelated;" />
	<div class="player-name">{player.username}</div>
</div>

<style lang="scss">
	.player-head {
		padding-top: 12px;
		width: 160px;
		height: 100px;
		text-align: center;

		.player-head-img {
			position: relative;
			margin-left: auto;
			margin-right: auto;
			width: 60px;
			height: 60px;
			margin-bottom: 12px;
		}
	}
</style>
