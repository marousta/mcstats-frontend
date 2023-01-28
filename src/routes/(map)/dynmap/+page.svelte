<script lang="ts">
	import { onMount } from 'svelte';
	import { checkLocalDev } from '../../../lib/localDev';
	import { server_name, dynmap_suffix, dynmap_url } from '../../../stores/server_properties';

	let iframe: HTMLElement;

	onMount(() => {
		iframe.setAttribute(
			'src',
			checkLocalDev(dynmap_url, window.location.origin + dynmap_suffix),
		);
	});
</script>

<svelte:head>
	<title>Dynmap - {server_name}</title>
</svelte:head>

<iframe title="Dynmap" bind:this={iframe} />

<style lang="scss">
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}
</style>
