<script lang="ts">
	import { page, navigating } from '$app/stores';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';

	import Nav from '../components/Navbar/NavContainer.svelte';
	import Error from '../components/Error.svelte';

	import { serverKind } from '../stores/stores';
	import wsConnect from '../stores/ws';
	import { initFetchers } from '../stores/api';

	import { ServerKind } from '../types/global';
	import type { StoreFetcher } from '../types/stores';
	import { goto } from '$app/navigation';

	let load = [initFetchers(), wsConnect()];

	let endpoints: number = 0;

	function isServerKind(value: string) {
		const kind = Object.values(ServerKind)
			.filter((v) => v === value)
			.filter((x) => x);
		return kind.length !== 0;
	}

	function startup() {
		const path = $page.url.pathname.split('/')[1];
		if (isServerKind(path)) {
			return path as ServerKind;
		}
		if (path !== 'about') {
			endpoints = -1;
		}
		return $serverKind;
	}

	function understand(value: any | StoreFetcher | null) {
		const endp = Object.values(ServerKind)
			.filter((v) => value?.[v])
			.filter((x) => x);

		const length = endp.length;
		if (length) {
			const start = startup();
			$serverKind = isServerKind(start) ? start : endp[0];

			if (endpoints !== -1) {
				goto($page.url.pathname.replace(start, $serverKind), {
					replaceState: true,
				});
			}
		}

		endpoints = length;
		return length;
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
			$serverKind = startup();
			NProgress.done();
		}
	}
</script>

{#await Promise.all(load)}
	<div class="message">LOADING</div>
{:then ret}
	{#if !understand(ret[0])}
		<Error status={503} message={'No server available'} />
	{:else if endpoints === -1}
		<Error status={404} message={'Not found'} />
	{:else}
		<Nav endpoints={endpoints === 2} />
		<slot />
	{/if}
{/await}
