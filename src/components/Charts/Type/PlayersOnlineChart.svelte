<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';
	import α from 'color-alpha';

	import { getTime } from '$lib/time';

	import Graph from '../Graph.svelte';

	import type { HistoryPlayersData } from '../../../types/global';
	import { playersMaxOnline, serverKind } from '../../../stores/stores';

	export let label: string;
	export let config: ChartOptions;

	let canvas: HTMLCanvasElement;
	let initialized: boolean = false;
	let status: string;

	let chart: Chart;

	const options: ChartOptions = {
		...config,
	};

	// Store
	let history: HistoryPlayersData[] = $playersMaxOnline[$serverKind];

	function unfoldEntries(entries: HistoryPlayersData[]): [string[], number[]] {
		const labels: string[] = [];
		const data: number[] = [];

		entries.forEach((entry) => {
			data.push(entry.value);
			labels.push(new getTime(entry.date).full());
		});

		return [labels, data];
	}

	function genChart() {
		[chart.data.labels, chart.data.datasets[0].data] = unfoldEntries(history);

		if (chart.data.datasets.length != 0 && chart.data.datasets[0].data.length < 2) {
			status = 'No data';
		} else if (chart.data.datasets.length != 0) {
			initialized = true;
		}
		chart.update();
	}

	$: {
		if (history && chart) {
			genChart();
		}
	}

	onMount(() => {
		const backgroundColor: string = α('white', 0.1);
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}

		Chart.register(...registerables);
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						label,
						data: [],
						fill: true,
						backgroundColor,
						borderColor: 'white',
						borderWidth: 1,
					},
				],
			},
			options,
		});
	});
</script>

<Graph {label} bind:status bind:initialized bind:canvas />
