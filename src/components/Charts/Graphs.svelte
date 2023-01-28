<script lang="ts">
	import { daily, uptime } from '../../stores/ws';
	import type { DataEntry } from '../../types';
	import PlayersOnlineChart from '../Charts/PlayersOnlineChart.svelte';
	import PlayersLogtimeGraphBar from '../Charts/PlayerLogtimeGraphBar.svelte';
	import PlayersLogtimeGraph from '../Charts/PlayerLogtimeGraph.svelte';
	import UptimeGraph from '../Charts/UptimeGraph.svelte';

	let uptimeData: { up: number; down: number }[];
	let uptimeEntries: DataEntry[];

	$: {
		if (uptimeEntries) {
			for (const session of uptimeData) {
				uptimeEntries.push({ label: session.up.toString(), data: 0 });
				uptimeEntries.push({ label: session.up.toString(), data: 0 });
			}
		}
	}

	uptime.subscribe((value) => {
		uptimeData = value;
	});
</script>

<div class="graphs">
	<UptimeGraph />
	<PlayersOnlineChart backgroundColor="white" />
	<PlayersLogtimeGraphBar label="Players Logtime" entries={[]} />
	<PlayersLogtimeGraph label="Players Logtime History" entries={[]} />
</div>

<style lang="scss">
	.graphs {
		width: 900px;
		flex-wrap: wrap;
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}
</style>
