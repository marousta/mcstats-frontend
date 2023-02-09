<script lang="ts">
	import { server_name } from '../stores/server_properties';
	import { onMount } from 'svelte';
	import { serverKind } from '../stores/stores';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto($serverKind);
	});
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

<div class="message">LOADING</div>
