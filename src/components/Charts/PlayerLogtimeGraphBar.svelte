<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';

	import { playersLogtimes, serverKind } from '../../stores/stores';
	import { getTime } from '../../lib/time';
	import type { ResponseHistoryPlayersLogtimes } from '../../stores/types';
	import { get } from 'svelte/store';
	import type { ServerKind } from '../../stores/websocket/types';

	export let label: string;

	let canvas: HTMLCanvasElement;

	let chart: Chart;
	const options: ChartOptions = {
		locale: 'en-US',
		responsive: true,
		maintainAspectRatio: false,
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
		interaction: {
			intersect: false,
			mode: 'nearest',
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
	let history: ResponseHistoryPlayersLogtimes[];
	playersLogtimes.subscribe((value) => {
		if (!value[kind]) {
			console.log('Hm 2');
			return;
		}
		history = value[kind]!;
	});

	$: {
		if (history && chart) {
			let datasets = [];
			let labels: string[] = [];
			if (history.length > 0) {
				labels = history.map((p) => p.username);
			}
			const colors = history.map(() => {
				return `rgb(${Math.floor(Math.random() * 200 + 54).toString()},${Math.floor(
					Math.random() * 200 + 54,
				).toString()},${Math.floor(Math.random() * 200 + 54).toString()})`;
			});
			datasets.push({
				label: 'Total logtime',
				data: [...history.map((p) => p.current)],
				backgroundColor: colors,
			});
			chart.data.labels = [...labels, 'Today'];
			chart.data.datasets = datasets;
			if (chart.data.datasets.length != 0 && chart.data.datasets[0].data[0] !== undefined) {
				canvas.parentElement?.classList.add('initialized');
			} else {
				canvas.parentElement?.classList.add('no-data');
			}
			chart.update();
		}
	}

	onMount(() => {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}

		history = get(playersLogtimes)[get(serverKind)] ?? [];

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
