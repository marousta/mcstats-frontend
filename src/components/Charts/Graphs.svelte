<script lang="ts">
	import {
		initHistoryLogtimes,
		initHistoryPlayersMaxOnline,
		initHistoryServerUptime,
	} from '../../stores/api';
	import { serverKind } from '../../stores/stores';
	import type { ServerKind } from '../../stores/websocket/types';
	import PlayersLogtimeGraph from './PlayerLogtimeGraph.svelte';
	import PlayersLogtimeGraphBar from './PlayerLogtimeGraphBar.svelte';
	import PlayersOnlineChart from './PlayersOnlineChart.svelte';
	import UptimeGraph from './UptimeGraph.svelte';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import { get } from 'svelte/store';

	let kind: ServerKind = get(serverKind);

	serverKind.subscribe(async (value) => {
		kind = value;
	});

	if (browser) {
		serverKind.subscribe(async (value) => {
			await initHistoryLogtimes(value);
			await initHistoryPlayersMaxOnline(value);
			await initHistoryServerUptime(value);
		});
	}
</script>

<div class="graphs" in:fade={{ duration: 200, delay: 200 }}>
	<UptimeGraph label="Uptime" />
	<PlayersOnlineChart label="Max Players Online" />
	<PlayersLogtimeGraphBar label="Players Logtime" />
	<PlayersLogtimeGraph label="Players Logtime History" />
</div>

<style lang="scss">
	.graphs {
		width: 900px;
		flex-wrap: wrap;
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}
</style>
