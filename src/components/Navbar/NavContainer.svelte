<script lang="ts">
	import Desktop from './Desktop.svelte';
	import Hamburger from './Hamburger.svelte';
	import MediaQuery from '../MediaQuery.svelte';

	import { serverKind } from '../../stores/stores';

	import { items as entries, type HamburgerItem } from './items';

	export let endpoints: boolean;

	let hamburger_open: boolean = false;

	let items: HamburgerItem[] = sanitize(entries[$serverKind]);

	$: {
		items = sanitize(entries[$serverKind]);
	}

	function sanitize(entries: HamburgerItem[]) {
		return entries.filter((entry) => entry.href);
	}
</script>

<MediaQuery query="(max-width: 800px)" let:matches>
	{#if matches}
		<Hamburger {endpoints} bind:checked={hamburger_open}>
			{#each items as item}
				{#if item.new_tab}
					<a class="hamburger" href={item.href} target="_blank" rel="noreferrer"
						>{item.name}</a>
				{:else}
					<a
						class="hamburger"
						href={item.href}
						on:click={() => {
							hamburger_open = false;
						}}>{item.name}</a>
				{/if}
			{/each}
		</Hamburger>
	{:else}
		<Desktop {endpoints}>
			{#each items as item}
				{#if item.new_tab}
					<a class="desktop" href={item.href} target="_blank" rel="noreferrer"
						>{item.name}</a>
				{:else}
					<a class="desktop" href={item.href}>{item.name}</a>
				{/if}
			{/each}
		</Desktop>
	{/if}
</MediaQuery>

<style lang="scss">
	a.desktop {
		&:not(.title) {
			padding-left: 5px;
			padding-right: 5px;
		}
	}

	a.hamburger {
		text-decoration: none;
		color: #fff;
		font-weight: 500;
		font-size: 1.2rem;
		padding: 0.7rem;

		&:hover {
			font-weight: bolder;
		}
	}
</style>
