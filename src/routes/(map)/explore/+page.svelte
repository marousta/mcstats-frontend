<script lang="ts">
	import { onMount } from 'svelte';
	import { checkLocalDev } from '../../../lib/localDev';
	import { server_name, bluemap_suffix, bluemap_url } from '../../../stores/server_properties';

	let iframe: HTMLElement;

	onMount(() => {
		iframe.setAttribute(
			'src',
			checkLocalDev(bluemap_url, window.location.origin + bluemap_suffix),
		);
	});
</script>

<svelte:head>
	<title>Explore - {server_name}</title>
</svelte:head>

<iframe title="Explore" bind:this={iframe} />

<style lang="scss">
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}
</style>
