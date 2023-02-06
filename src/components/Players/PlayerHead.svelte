<script lang="ts">
	export let name: string;

	let playerPromise = 'https://crafthead.net/avatar/';
</script>

<div class="player-head">
	<div
		class="player-head-img"
		style="background: url('/heads/Steve.png'); color: white; background-size: 100%; image-rendering: pixelated;" />
	<div class="player-name">{name}</div>
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
