<script lang="ts">
	import { server_name } from '$stores/server_properties';
</script>

<svelte:head>
	<title>Dynmap - {server_name}</title>
</svelte:head>
<iframe title="Dynmap" src="/dynmap/" />

<style lang="scss">
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}
</style>
