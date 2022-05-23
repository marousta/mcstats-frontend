<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto/auto.js';
	import α from 'color-alpha';

	import type { DataEntry } from '$types';
	import { unfoldEntries } from '$types';
	import { daily } from '$stores/ws';

	let maxPlayersOnlineData: { date: string; maxPlayers: number }[];
	let chart: Chart;

	daily.subscribe((value) => (maxPlayersOnlineData = value));

	let entries: DataEntry[] = [];
	let label = 'Max Players Online';

	$: {
		entries = maxPlayersOnlineData.map((obj) => {
			return { data: obj.maxPlayers, label: obj.date };
		});
		if (chart) {
			[chart.data.labels, chart.data.datasets[0].data] = unfoldEntries(entries);
			if (chart.data.datasets.length != 0 && chart.data.datasets[0].data.length < 2) {
				canvas.parentElement?.classList.add("no-data");
			} else if (chart.data.datasets.length != 0) {
				canvas.parentElement?.classList.add("initialized");
			}
			chart.update();
		}
	}

	export let backgroundColor = 'blue';
	export let borderColor = backgroundColor;
	export let borderWidth = 1;

	let backgroundColorFinal: string;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		backgroundColor = α(backgroundColor, 0.1);
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}
		chart = new Chart(ctx, {
			locale: "en-US",
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						label,
						data: [],
						fill: true,
						backgroundColor,
						borderColor,
						borderWidth
					}
				]
			},
			options: {
				tension: 0.2,
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				interaction: {
					intersect: false,
					mode: 'nearest'
				},
				elements: {
					point: {
						radius: 0
					}
				},
				animation: {
					duration: 0
				},
				scales: {
					y: {
						ticks: {
							display: false
						},
						grid: {
							color: '#222222'
						},
						beginAtZero: true
					},
					x: {
						ticks: {
							display: false
						},
						grid: {
							color: '#222222'
						}
					}
				}
			}
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
