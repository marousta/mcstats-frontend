<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js';
	import type { DataEntry } from '../../types';
	import { unfoldEntries } from '../../types';
	import { totalLogtime } from '../../stores/ws';
	import type { TotalLogtime } from '../../types';
	import getTime from '../../lib/time';

	let players: TotalLogtime[] = [];
	totalLogtime.subscribe((value) => (players = value));

	export let entries: DataEntry[];
	export let label: string;

	let chart: Chart;

	$: {
		if (players && chart) {
			let datasets = [];
			let labels: string[] = [];
			if (players.length > 0) {
				labels = players.map((p) => p.username);
			}
			const colors = players.map(() => {
				return `rgb(${Math.floor(Math.random() * 200 + 54).toString()},${Math.floor(
					Math.random() * 200 + 54,
				).toString()},${Math.floor(Math.random() * 200 + 54).toString()})`;
			});
			datasets.push({
				label: 'Total logtime',
				data: [...players.map((p) => p.todayLogtime)],
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

	let canvas: HTMLCanvasElement;

	let [labels, data] = unfoldEntries(entries);

	onMount(() => {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}
		chart = new Chart(ctx, {
			// locale: 'en-US',
			type: 'bar',
			data: {
				labels,
				datasets: [],
			},
			options: {
				// tension: 0,
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
			},
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
