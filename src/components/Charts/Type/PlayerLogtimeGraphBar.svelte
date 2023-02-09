<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';

	import { getTime } from '$lib/time';
	import genColor from '$lib/generate_color';

	import Graph from '../Graph.svelte';

	import { playersLogtimes, serverKind } from '../../../stores/stores';
	import type { ResponseHistoryPlayersLogtimes } from '../../../types/api';

	export let label: string;
	export let config: ChartOptions;

	let canvas: HTMLCanvasElement;
	let initialized: boolean = false;
	let status: string;

	let chart: Chart;

	const options: ChartOptions = {
		...config,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						return new getTime(parseInt(context.raw)).logtime();
					},
				},
			},
		},
	};

	let history: ResponseHistoryPlayersLogtimes[] = $playersLogtimes[$serverKind];

	function genChart() {
		let datasets = [];
		let labels: string[] = [];

		if (history.length > 0) {
			labels = history.map((p) => p.username);
		}

		datasets.push({
			label: 'Total logtime',
			data: [...history.map((p) => p.current)],
			backgroundColor: history.map((entry) => genColor(entry.username)),
		});

		chart.data.labels = [...labels, 'Today'];
		chart.data.datasets = datasets;

		if (chart.data.datasets.length != 0 && chart.data.datasets[0].data[0] !== undefined) {
			initialized = true;
		} else {
			status = 'No data';
		}
		chart.update();
	}

	$: {
		if (history && chart) {
			genChart();
		}
	}

	onMount(() => {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}

		Chart.register(...registerables);
		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['new'],
				datasets: [],
			},
			options,
		});
	});
</script>

<Graph {label} bind:status bind:initialized bind:canvas />
