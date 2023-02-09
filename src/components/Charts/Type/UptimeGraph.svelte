<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';
	import α from 'color-alpha';

	import Graph from '../Graph.svelte';

	import { getTime } from '$lib/time';

	import type { ServerUptimeData } from '../../../types/global';
	import { serverKind, serverUptime } from '../../../stores/stores';

	export let label: string;
	export let config: ChartOptions;

	let backgroundColor = 'blue';

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
						return new getTime(context.raw.y).logtime();
					},
				},
			},
		},
		elements: {
			point: {
				radius: 0,
				backgroundColor: 'cyan',
			},
			line: {
				backgroundColor: α('cyan', 0.1),
				borderColor: 'cyan',
				borderWidth: 1,
				fill: true,
			},
		},
	};

	let uptime: ServerUptimeData[] = $serverUptime[$serverKind];

	function genChart() {
		const data = uptime.map((v) => [
			{
				x: v.up,
				y: 0,
			},
			{
				x: v.down,
				y: v.down - v.up,
			},
			{
				x: v.down,
				y: 0,
			},
		]);
		let set: { x: number; y: number }[] = [];

		for (const tuple of data) {
			set = [...set, ...tuple];
		}

		set.pop();

		const ts = new Date().valueOf() / 1000;
		if (set.length > 0) {
			set[set.length - 1].x = -set[set.length - 1].y;
			set[set.length - 1].y = ts - set[set.length - 1].x;
			set[set.length - 1].x = ts;
		}

		chart.data.datasets = [
			{
				data: [...set],
				showLine: true,
			},
		];
		if (chart.data.datasets.length != 0 && chart.data.datasets[0].data[0] !== undefined) {
			initialized = true;
		} else {
			status = 'No data';
		}
		chart.update();
	}

	$: {
		if (uptime && chart) {
			genChart();
		}
	}

	onMount(() => {
		backgroundColor = α(backgroundColor, 0.1);
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not create Canvas Context');
			return;
		}

		Chart.register(...registerables);
		chart = new Chart(ctx, {
			type: 'scatter',
			data: { datasets: [] },
			options,
		});
	});
</script>

<Graph {label} bind:status bind:initialized bind:canvas />
