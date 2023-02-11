<script lang="ts">
	import { fade } from 'svelte/transition';

	export let label: string;
	export let initialized: boolean = false;
	export let status: string = 'Loading';
	export let canvas: HTMLCanvasElement | null = null;

	let expand: boolean = false;

	function click() {
		expand = !expand;
	}
</script>

<div class="graph" class:expand>
	<div class="graph-name">{label}</div>
	{#if expand}
		<button on:click={click} transition:fade={{ duration: 200 }} class="reduce"
			><span> ┘└</span><span> ┐┌</span></button>
	{:else}
		<button on:click={click} transition:fade={{ duration: 200 }}
			><span>┌ ┐</span><span>└ ┘</span></button>
	{/if}
	<div class="graph-container" class:initialized data-info={status}>
		<canvas bind:this={canvas} width="100%" height="100%" />
	</div>
</div>

<style lang="scss">
	.graph {
		position: relative;
		margin: 20px;
		background-color: rgb(22, 24, 28);
		width: 600px;
		padding: 20px;
		padding-top: 12px;
		border-radius: 15px;
		transition: 0.2s steps(6);

		&.expand {
			z-index: 1;
			position: absolute;
			width: 98%;
			box-sizing: border-box;
			height: calc(100vh - 100px);

			.graph-container {
				height: calc(100% - 35px);
			}
		}
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

	button {
		margin: 0;
		padding: 0;
		position: absolute;
		top: 6px;
		right: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transform: scaleY(0.6645);
		cursor: pointer;
		background-color: transparent;
		border-color: transparent;
		color: #fff;

		span {
			display: block;

			&:last-child {
				margin-top: 4px;
			}
		}

		&.reduce {
			top: 3px;
			right: 17px;
			transform: scale3d(0.8, 0.5256, 1);
			padding: 5px;

			span:last-child {
				margin-top: 0px;
			}
		}
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
