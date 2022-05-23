<script lang="ts">
	import { fetchPlayerSkin } from '$stores/head';

	let container: HTMLDivElement;

	export let name: string;

	let playerPromise = fetchPlayerSkin(name);
</script>

<div class="player-head">
	{#await playerPromise}
		<div
			class="player-head-img"
			style="background: url('/heads/Loading.png'); background-size: 100%; image-rendering: pixelated;"
		/>
	{:then skin}
		<div
			class="player-head-img finished"
			style="background: url('{skin}'); background-size: 100%; image-rendering: pixelated;"
		/>
	{:catch}
		<div
			class="player-head-img"
			style="background: url('/heads/Steve.png'); color: white; background-size: 100%; image-rendering: pixelated;"
		/>
	{/await}
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
