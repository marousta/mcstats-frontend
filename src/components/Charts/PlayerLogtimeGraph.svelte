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
		line: {
			datasets: {
				tension: 0,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						return (
							context.dataset.label +
							': ' +
							new getTime(parseInt(context.raw)).logtime()
						);
					},
				},
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
			console.log('Hm 1');
			return;
		}
		history = value[kind]!;
	});

	// count max elements in data
	function getMaxElements(players: ResponseHistoryPlayersLogtimes[]): number {
		let maxElements: number = 0;
		players.forEach((player) => {
			let elementsCount: number = 0;
			player.data.forEach(() => {
				elementsCount++;
			});

			if (maxElements < elementsCount) {
				maxElements = elementsCount;
			}
		});

		return maxElements;
	}

	// fill empty data with zeros
	function fillData(player: ResponseHistoryPlayersLogtimes, max: number): Array<number> {
		const logtimeHistory: Array<number> = player.data.map((n) => n.value);
		if (logtimeHistory.length == max) {
			return logtimeHistory;
		}

		let ret: Array<number> = [];
		for (let i = 0; i < max - logtimeHistory.length; i++) {
			ret.push(0);
		}

		return [...ret, ...logtimeHistory];
	}

	$: {
		if (history && chart) {
			let datasets = [];
			let labels: string[] = [];
			if (history.length > 0) {
				labels = history[0].data.map((n) => new getTime(n.date).full());
			}
			let maxElements: number = getMaxElements(history);
			for (const player of history) {
				datasets.push({
					label: player.username,
					data: [...fillData(player, maxElements), player.current],
					backgroundColor: 'transparent',
					borderColor:
						'rgb(' +
						Math.floor(Math.random() * 200 + 54).toString() +
						',' +
						Math.floor(Math.random() * 200 + 54).toString() +
						',' +
						Math.floor(Math.random() * 200 + 54).toString() +
						')',
					borderWidth: 1,
				});
			}
			chart.data.labels = [...labels, 'Today'];
			chart.data.datasets = datasets;
			if (chart.data.datasets.length == 0 || chart.data.datasets[0].data.length < 2) {
				canvas.parentElement?.classList.add('no-data');
			} else if (chart.data.datasets.length != 0) {
				canvas.parentElement?.classList.add('initialized');
			}
			chart.update();
		}
	}

	onMount(async () => {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not create Canvas Context');
		}

		history = get(playersLogtimes)[get(serverKind)] ?? [];

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
