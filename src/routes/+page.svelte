<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { serverKind } from '../stores/stores';
	import { server_name } from '../stores/server_properties';

	onMount(() => {
		goto($serverKind);
	});
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

<div class="message">LOADING</div>
