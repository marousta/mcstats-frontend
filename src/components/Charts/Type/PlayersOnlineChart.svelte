<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';

	import Graph from '../Graph.svelte';

	import { getTime } from '$lib/time';

	import type { HistoryPlayersData } from '../../../types/global';
	import { playersMaxOnline, serverKind } from '../../../stores/stores';

	export let label: string;
	export let config: ChartOptions;

	let canvas: HTMLCanvasElement;
	let initialized: boolean = false;
	let status: string;

	let chart: Chart;

	const options: any = {
		...config,
	};

	let history: HistoryPlayersData[] = $playersMaxOnline[$serverKind];

	function genChart() {
		chart.data.labels = history.map((n) => new getTime(n.date).full());
		chart.data.datasets = [
			{
				label: 'Players',
				data: history.map((h) => h.value),
				borderColor: '#FFF',
				backgroundColor: '#FFFFFF11',
				fill: true,
				borderWidth: 1,
			},
		];

		if (chart.data.datasets.length == 0 || chart.data.datasets[0].data.length < 2) {
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

	onMount(async () => {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not create Canvas Context');
		}

		Chart.register(...registerables);
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ['new'],
				datasets: [],
			},
			options,
		});
	});
</script>

<Graph {label} bind:status bind:initialized bind:canvas />
