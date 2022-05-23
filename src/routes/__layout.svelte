<script lang="ts">
	import { onMount } from 'svelte';

	import { connect } from '$stores/ws';
	import Footer from '$components/Footer.svelte';
	import Nav from '$components/Nav.svelte';
	import ModalContainer from '$components/Modal/ModalContainer.svelte';
	import { server_name } from '$stores/server_properties';

	onMount(() => {
		connect();
	});
</script>

<Nav siteName={server_name} />
<ModalContainer />
<slot />
<Footer />
