<script lang="ts">
	import { daily, uptime } from '$stores/ws.ts';
	import type { DataEntry } from '$types';
	import PlayersOnlineChart from '$components/Charts/PlayersOnlineChart.svelte';
	import PlayersLogtimeGraphBar from '$components/Charts/PlayerLogtimeGraphBar.svelte';
	import PlayersLogtimeGraph from '$components/Charts/PlayerLogtimeGraph.svelte';
	import UptimeGraph from '$components/Charts/UptimeGraph.svelte';

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
