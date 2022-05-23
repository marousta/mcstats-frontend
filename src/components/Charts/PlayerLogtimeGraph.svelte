<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto/auto.js';
	import type { DataEntry } from '$types';
	import { unfoldEntries } from '$types';
	import { totalLogtime, type TotalLogtime } from '$stores/ws';
	import getTime from '$lib/time';

	let players: TotalLogtime[] = [];
	totalLogtime.subscribe((value) => (players = value));

	export let entries: DataEntry[];
	export let label: string;

	export let borderWidth = 1;
	let chart: Chart;

	function getMaxElements(players): number
	{
		let maxElements: number = 0;
		for (const player of players) {
			let elementsCount: number = 0;
			for (const data of player.data) {
				elementsCount++;
			}
			if (maxElements < elementsCount) {
				maxElements = elementsCount;
			}
		}
		return maxElements;
	}

	function mapData(player, max: number): Array<number>
	{
		const logtimeHistory: Array<number> = player.data.map((n) => n.logtime);
		if (logtimeHistory.length == max) {
			return logtimeHistory;
		}
		let ret: Array<number> = [];
		for (let i = 0; i < max - logtimeHistory.length; i++) {
			ret.push(0);
		}
		ret = [...ret, ...logtimeHistory];
		return ret;
	}

	$: {
		if (players && chart) {
			let datasets = [];
			let labels: string[] = [];
			if (players.length > 0) {
				labels = players[0].data.map((n) => n.date);
			}
			let maxElements: number = getMaxElements(players);
			for (const player of players) {
				datasets.push({
					label: player.username,
					data: [...mapData(player, maxElements), player.todayLogtime],
					backgroundColor: 'transparent',
					borderColor:
						'rgb(' +
						Math.floor(Math.random() * 200 + 54).toString() +
						',' +
						Math.floor(Math.random() * 200 + 54).toString() +
						',' +
						Math.floor(Math.random() * 200 + 54).toString() +
						')',
					borderWidth
				});
			}
			chart.data.labels = [...labels, 'Today'];
			chart.data.datasets = datasets;
			if (chart.data.datasets.length == 0 || chart.data.datasets[0].data.length < 2) {
				canvas.parentElement?.classList.add("no-data");
			} else if (chart.data.datasets.length != 0) {
				canvas.parentElement?.classList.add("initialized");
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
			locale: "en-US",
			type: 'line',
			data: {
				labels,
				datasets: []
			},
			options: {
				tension: 0,
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							label: function(context) {
								return context.dataset.label + ": " + new getTime(parseInt(context.raw)).logtime();
							}
						}
					},
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
