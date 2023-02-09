<script lang="ts">
	import GraphsContainer from '../../../components/Charts/GraphsContainer.svelte';
	import { server_name } from '../../../stores/server_properties';
</script>

<svelte:head>
	<title>Graphs - {server_name}</title>
</svelte:head>

<GraphsContainer />
