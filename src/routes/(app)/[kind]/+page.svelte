<script lang="ts">
	import Vanilla from '../../../components/Home/Vanilla.svelte';
	import Modded from '../../../components/Home/Modded.svelte';
	import { server_name } from '../../../stores/server_properties';
	import { serverKind } from '../../../stores/stores';
	import { ServerKind } from '../../../stores/websocket/types';
	import { get } from 'svelte/store';

	let kind: ServerKind = get(serverKind);
	serverKind.subscribe((value) => {
		kind = value;
	});
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

{#if kind === ServerKind.Vanilla}
	<Vanilla />
{:else if kind === ServerKind.Modded}
	<Modded />
{/if}
