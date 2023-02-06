<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import Graphs from '../../../../components/Charts/Graphs.svelte';
	import { server_name } from '../../../../stores/server_properties';
	import { serverKind } from '../../../../stores/stores';
	import { ServerKind } from '../../../../stores/websocket/types';

	let kind: ServerKind = get(serverKind);
	serverKind.subscribe((value) => {
		kind = value;
	});
</script>

<svelte:head>
	<title>Graphs - {server_name}</title>
</svelte:head>

{#if kind === ServerKind.Vanilla}
	<Graphs />
{:else if kind === ServerKind.Modded}
	<Graphs />
{/if}
