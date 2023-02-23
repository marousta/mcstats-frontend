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
	function getMaxElements(players: ResponseHistoryPlayersLogtimes[]): [number, number] {
		let max_elements: number = 0;
		let found_index: number = 0;

		for (const i in players) {
			let elementsCount: number = 0;

			for (const data of players[i].data) {
				elementsCount++;
			}

			if (max_elements < elementsCount) {
				max_elements = elementsCount;
				found_index = +i;
			}
		}

		return [max_elements, found_index];
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

		const [max_elements, found_index]: [number, number] = getMaxElements(history);

		if (history.length > 0) {
			labels = history[found_index].data.map((n) => {
				const s = n.date.split('T');
				s[1] = '00:00:00.000Z';
				return new getTime(s.join('T')).lite();
			});
		}

		for (const player of history) {
			datasets.push({
				label: player.username,
				data: [...fillData(player, max_elements), player.current],
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
