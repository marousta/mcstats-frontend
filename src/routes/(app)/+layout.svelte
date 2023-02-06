<script lang="ts">
	import Nav from '../../components/Navbar/Nav.svelte';
	import ModalContainer from '../../components/Modal/ModalContainer.svelte';
	import { server_name } from '../../stores/server_properties';
	import wsConnect from '../../stores/websocket/ws';
	import { initFetchers } from '../../stores/api';
</script>

{#await initFetchers()}
	<div
		style="z-index: -1; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)">
		LOADING
	</div>
{:then}
	{#await wsConnect()}
		<div
			style="z-index: -1; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)">
			LOADING
		</div>
	{:then}
		<Nav />
		<ModalContainer />
		<slot />
	{/await}
{/await}
