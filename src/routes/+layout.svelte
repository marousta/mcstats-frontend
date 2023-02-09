<script lang="ts">
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/stores';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';

	import Nav from '../components/Navbar/NavContainer.svelte';
	import Error from '../components/Error.svelte';

	import { serverKind } from '../stores/stores';

	import { ServerKind } from '../types/global';
	import type { StoreFetcher } from '../types/stores';
	import { initFetchers } from '../stores/api';
	import wsConnect from '../stores/ws';

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
