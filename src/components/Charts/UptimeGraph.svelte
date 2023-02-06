<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartOptions } from 'chart.js';
	import α from 'color-alpha';

	import { serverKind, serverUptime } from '../../stores/stores';
	import { getTime } from '../../lib/time';
	import type { ServerKind } from '../../stores/websocket/types';
	import { get } from 'svelte/store';
	import type { ServerUptimeData } from '../../stores/types';

	export let label: string;

	let backgroundColor = 'blue';

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
						return new getTime(context.raw.y).logtime();
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
				backgroundColor: 'cyan',
			},
			line: {
				backgroundColor: α('cyan', 0.1),
				borderColor: 'cyan',
				borderWidth: 1,
				fill: true,
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
	let uptime: ServerUptimeData[];
	serverUptime.subscribe((value) => {
		if (!value[kind]) {
			console.log('Hm 4');
			return;
		}
		uptime = value[kind]!;
	});

	$: {
		if (uptime && chart) {
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
				canvas.parentElement?.classList.add('initialized');
			} else {
				canvas.parentElement?.classList.add('no-data');
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

		uptime = get(serverUptime)[get(serverKind)] ?? [];

		Chart.register(...registerables);
		chart = new Chart(ctx, {
			type: 'scatter',
			data: { datasets: [] },
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
