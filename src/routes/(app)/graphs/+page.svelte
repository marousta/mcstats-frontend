<script>
	import Graphs from '../../../components/Charts/Graphs.svelte';
	import { server_name } from '../../../stores/server_properties';
</script>

<svelte:head>
	<title>Graphs - {server_name}</title>
</svelte:head>

<Graphs />
