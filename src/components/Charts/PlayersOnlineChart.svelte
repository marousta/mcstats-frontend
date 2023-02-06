<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';
	import α from 'color-alpha';

	import { playersMaxOnline, serverKind } from '../../stores/stores';
	import type { ResponseHistoryPlayersMaxOnline } from '../../stores/types';
	import { getTime } from '$lib/time';
	import type { ServerKind } from '../../stores/websocket/types';
	import { get } from 'svelte/store';

	export let label: string;
	let backgroundColor: string = 'white';

	let canvas: HTMLCanvasElement;

	let chart: Chart;
	const options: ChartOptions = {
		locale: 'en-US',
		responsive: true,
		maintainAspectRatio: false,
		line: {
			datasets: {
				tension: 0,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
		interaction: {
			intersect: false,
			mode: 'nearest',
		},
		elements: {
			point: {
				radius: 0,
			},
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
				},
				beginAtZero: true,
			},
			x: {
				ticks: {
					display: false,
				},
				grid: {
					color: '#222222',
				},
			},
		},
	};

	// Store
	const kind: ServerKind = get(serverKind);
	let history: ResponseHistoryPlayersMaxOnline[];
	playersMaxOnline.subscribe((value) => {
		if (!value[kind]) {
			console.log('Hm 3');
			return;
		}
		history = value[kind]!;
	});

	//
	function unfoldEntries(entries: ResponseHistoryPlayersMaxOnline[]): [string[], number[]] {
		const labels: string[] = [];
		const data: number[] = [];

		entries.forEach((entry) => {
			data.push(entry.value);
			labels.push(new getTime(entry.date).full());
		});

		return [labels, data];
	}

	$: {
		if (history && chart) {
			[chart.data.labels, chart.data.datasets[0].data] = unfoldEntries(history);

			if (chart.data.datasets.length != 0 && chart.data.datasets[0].data.length < 2) {
				canvas.parentElement?.classList.add('no-data');
			} else if (chart.data.datasets.length != 0) {
				canvas.parentElement?.classList.add('initialized');
			}
			chart.update();
		}
	}

	onMount(() => {
		backgroundColor = α(backgroundColor, 0.1);
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}

		history = get(playersMaxOnline)[get(serverKind)] ?? [];

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
						borderColor: backgroundColor,
						borderWidth: 1,
					},
				],
			},
			options,
		});
	});
</script>

<div class="graph">
	<div class="graph-name">{label}</div>
	<div class="graph-container">
		<canvas bind:this={canvas} width="10" height="10" />
	</div>
</div>

<style lang="scss">
	.graph {
		margin: 20px;
		background-color: rgb(22, 24, 28);
		width: 600px;
		padding: 20px;
		padding-top: 12px;
		border-radius: 15px;
	}
	.graph-container {
		margin-top: 16px;
		height: 300px;
	}
	.graph-name {
		display: grid;
		place-items: center;
		text-align: center;
		font-size: 20px;
	}

	@media screen and (max-width: 800px) {
		.graph {
			width: 400px;
		}

		.graph-container {
			height: 200px;
		}
	}
</style>
