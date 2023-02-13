<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';
	import { server_name } from '../../stores/server_properties';
	import { serverKind } from '../../stores/stores';
	import { ServerKind } from '../../stores/websocket/types';
	import Switcher from './Switcher.svelte';

	let kind: ServerKind;

	serverKind.subscribe((value) => {
		kind = value;
	});
</script>

<div class="navbar">
	<a class="title" href="/{kind}">{server_name}</a>
	<Switcher left={ServerKind.Vanilla} right={ServerKind.Modded} />
	{#if kind === ServerKind.Vanilla}
		<div class="navigation" transition:fade|local={{ duration: 200, delay: 100 }}>
			<a href="/{kind}">Home</a>
			<a href="/{kind}/graphs">Graphs</a>
			<!--- #FIXME -->
			<a href="/map/" target="_blank" rel="noreferrer">Dynmap</a>
			<!--- #FIXME -->
			<a href="/3dmap/" target="_blank" rel="noreferrer">Explore</a>
			<a href="/about">About</a>
		</div>
	{:else if kind === ServerKind.Modded}
		<div class="navigation" transition:fade|local={{ duration: 200, delay: 100 }}>
			<a href="/{kind}">Home</a>
			<a href="/{kind}/graphs">Graphs</a>
			<a href="/about">About</a>
		</div>
	{:else}
		{() => {
			throw error(404);
		}}
	{/if}
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
