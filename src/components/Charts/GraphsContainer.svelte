<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { ChartOptions } from 'chart.js';

	import PlayersLogtimeGraph from './Type/PlayerLogtimeGraph.svelte';
	import PlayersLogtimeGraphBar from './Type/PlayerLogtimeGraphBar.svelte';
	import PlayersOnlineChart from './Type/PlayersOnlineChart.svelte';
	import UptimeGraph from './Type/UptimeGraph.svelte';

	import { serverKind } from '../../stores/stores';
	import {
		initHistoryLogtimes,
		initHistoryPlayersMaxOnline,
		initHistoryServerUptime,
	} from '../../stores/api';

	let promises: Promise<void>[] = [];

	$: {
		promises = [
			initHistoryLogtimes($serverKind),
			initHistoryPlayersMaxOnline($serverKind),
			initHistoryServerUptime($serverKind),
		];
	}

	const default_config: ChartOptions = {
		locale: 'en-US',
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		interaction: {
			intersect: false,
			mode: 'nearest',
		},
		animation: {
			duration: 0,
		},
		scales: {
			y: {
				ticks: {
					display: false,
				},
				grid: {
					color: '#222222',
					display: false,
				},
				beginAtZero: true,
			},
			x: {
				ticks: {
					display: false,
				},
				grid: {
					color: '#222222',
					display: false,
				},
			},
		},
	};

	const line_config = {
		...default_config,
		line: {
			datasets: {
				tension: 0,
			},
		},
		elements: {
			point: {
				radius: 0,
			},
		},
	};
</script>

{#await Promise.all(promises)}
	<div class="message">LOADING</div>
{:then}
	<div class="graphs" in:fade={{ duration: 200, delay: 200 }}>
		<UptimeGraph label="Uptime" config={line_config} />
		<PlayersOnlineChart label="Max Players Online" config={line_config} />
		<PlayersLogtimeGraphBar label="Players Logtime" config={default_config} />
		<PlayersLogtimeGraph label="Players Logtime History" config={line_config} />
	</div>
{/await}

<style lang="scss">
	.graphs {
		width: 900px;
		flex-wrap: wrap;
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}
</style>
