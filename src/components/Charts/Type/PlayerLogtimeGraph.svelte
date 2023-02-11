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
						return (
							context.dataset.label +
							': ' +
							new getTime(parseInt(context.raw)).logtime()
						);
					},
				},
			},
		},
	};

	let history: ResponseHistoryPlayersLogtimes[] = $playersLogtimes[$serverKind];

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

	function genChart() {
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
				borderColor: genColor(player.username),
				borderWidth: 1,
			});
		}

		chart.data.labels = [...labels, 'Today'];
		chart.data.datasets = datasets;

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
