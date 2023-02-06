<script lang="ts">
	import Home from '../../components/Home/Vanilla.svelte';
	import { server_name } from '../../stores/server_properties';
	import { onMount } from 'svelte';

	onMount(() => {
		window.scrollTo(0, 1);
	});
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

<Home />
