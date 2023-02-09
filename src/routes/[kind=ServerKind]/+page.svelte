<script lang="ts">
	import { server_name } from '../../stores/server_properties';
	import { onMount } from 'svelte';
	import { serverKind } from '../../stores/stores';
	import Vanilla from '../../components/Home/Vanilla.svelte';
	import { goto } from '$app/navigation';
	import { ServerKind } from '../../stores/websocket/types';
	import Modded from '../../components/Home/Modded.svelte';
	import Error from '../../components/Error.svelte';

	$: {
		$serverKind;
	}
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

{#key $serverKind}
	{#if $serverKind === ServerKind.Vanilla}
		<Vanilla />
	{:else if $serverKind === ServerKind.Modded}
		<Modded />
	{:else}
		<Error status={410} message={'Gone'} />
	{/if}
{/key}
