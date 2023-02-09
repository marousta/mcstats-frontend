<script lang="ts">
	import Nav from '../components/Navbar/NavContainer.svelte';
	import wsConnect from '../stores/websocket/ws';
	import { initFetchers } from '../stores/api';
	import { ServerKind } from '../stores/websocket/types';
	import type { StoreFetcher } from '../stores/types';
	import { serverKind } from '../stores/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Error from '../components/Error.svelte';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import 'nprogress/nprogress.css';
	import { onMount } from 'svelte';

	let load = [initFetchers(), wsConnect()];

	let endpoints: number = 0;

	function startup() {
		return $page.url.pathname.split('/')[1] as ServerKind;
	}

	function understand(value: any | StoreFetcher | null) {
		const endp = Object.values(ServerKind)
			.filter((v) => value?.[v])
			.filter((x) => x);

		endpoints = endp.length;
		return endp.length;
	}

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false,
		template:
			'<div class="bar" role="bar" style="background-color: #FFF"><div class="peg" style="box-shadow: 0 0 10px #FFF, 0 0 5px #FFF;"></div></div>',
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

	onMount(() => {
		$serverKind = startup();
	});
</script>

{#await Promise.all(load)}
	<div class="message">LOADING</div>
{:then ret}
	{#if !understand(ret[0])}
		<Error status={503} message={'No server available'} />
	{:else}
		<Nav endpoints={endpoints === 2} />
		<slot />
	{/if}
{/await}
