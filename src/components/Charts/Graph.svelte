<script lang="ts">
	export let label: string;
	export let initialized: boolean = false;
	export let status: string = 'Loading';
	export let canvas: HTMLCanvasElement | null = null;
</script>

<div class="graph">
	<div class="graph-name">{label}</div>
	<div class="graph-container" class:initialized data-info={status}>
		<canvas bind:this={canvas} width="100%" height="100%" />
	</div>
</div>

<style lang="scss">
	.graph {
		margin: 20px;
		background-color: rgb(22, 24, 28);
		width: 600px;
		padding: 20px;
		padding-top: 12px;
		border-radius: 15px;
	}

	.graph-container {
		margin-top: 16px;
		height: 300px;
		position: relative;

		&:not(.initialized)::after {
			content: attr(data-info);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgba(0, 0, 0, 0.5);
			font-size: 30px;
			font-weight: lighter;
		}
	}
	.graph-name {
		display: grid;
		place-items: center;
		text-align: center;
		font-size: 20px;
	}

	@media screen and (max-width: 800px) {
		.graph {
			width: 400px;
		}

		.graph-container {
			height: 200px;
		}
	}
</style>
