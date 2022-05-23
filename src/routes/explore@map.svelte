<script lang="ts">
	import { server_name } from '$stores/server_properties';
</script>

<svelte:head>
	<title>Explore - {server_name}</title>
</svelte:head>

<iframe title="Explore" src="/3dmap" />

<style lang="scss">
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}
</style>
