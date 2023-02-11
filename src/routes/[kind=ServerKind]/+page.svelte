<script lang="ts">
	import Vanilla from '../../components/Home/Vanilla.svelte';
	import Modded from '../../components/Home/Modded.svelte';
	import Error from '../../components/Error.svelte';

	import { serverKind } from '../../stores/stores';
	import { ServerKind } from '../../types/global';
	import { server_name } from '../../stores/server_properties';

	$: {
		$serverKind;
	}
</script>

<svelte:head>
	<title>{server_name}</title>
</svelte:head>

{#if $serverKind === ServerKind.Vanilla}
	<Vanilla />
{:else if $serverKind === ServerKind.Modded}
	<Modded />
{:else}
	<Error status={410} message={'Gone'} />
{/if}
