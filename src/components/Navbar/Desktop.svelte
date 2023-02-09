<script lang="ts">
	import { server_name } from '../../stores/server_properties';
	import { serverKind } from '../../stores/stores';
	import { ServerKind } from '../../stores/websocket/types';
	import Switcher from './Switcher.svelte';

	export let endpoints: boolean;
</script>

<div class="navbar">
	<a class="title" href="/{$serverKind}">{server_name}</a>
	{#if endpoints}
		<Switcher left={ServerKind.Vanilla} right={ServerKind.Modded} />
	{/if}
	<div class="navigation">
		<slot />
	</div>
</div>

<style lang="scss">
	.navbar {
		flex-shrink: 0;
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 56px;
		background-color: #000;
		border-bottom: 1px solid #2f3333;

		.title {
			text-align: right;
			margin-right: 20px;
			min-width: 150px;
			font-size: 20px;
		}

		.navigation {
			position: absolute;
			right: 0;
			padding-right: 40px;

			a {
				&:not(.title) {
					padding-left: 5px;
					padding-right: 5px;
				}
			}
		}
	}

	@media screen and (max-width: 800px) {
		.title {
			display: none;
		}

		.navigation {
			display: flex;
			justify-content: center;
			font-size: 18px;
			padding-right: 0 !important;
			width: 100%;
		}
	}
</style>
