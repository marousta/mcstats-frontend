<script lang="ts">
	import { mcInfos, serverKind } from '../../stores/stores';
	import { ServerKind, type ResponseServerInfos } from '../../stores/websocket/types';
	import type { StoreMcVersion } from '../../stores/types';
	import { fly } from 'svelte/transition';
	import PlayersOnline from '../Players/PlayersOnline.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let mc_infos: ResponseServerInfos;
	mcInfos.subscribe((value: StoreMcVersion) => {
		mc_infos = value[ServerKind.Modded];
	});

	onMount(() => {
		mc_infos = get(mcInfos)[ServerKind.Modded];
	});
</script>

<div
	class="container"
	in:fly={{ x: 200, duration: 200, delay: 200 }}
	out:fly={{ x: 200, duration: 200 }}
>
	<div class="disclaimer">
		Modpack <b>All the Mods 8</b> (1.0.8) on Minecraft
		{#if mc_infos && mc_infos.java}
			<b>{mc_infos.java.version}</b>
		{/if}
	</div>
	<div class="tips">
		Download it :
		<ul>
			<li>
				<a
					class="link"
					target="_blank"
					rel="noreferrer"
					href="https://www.curseforge.com/minecraft/modpacks/all-the-mods-8/files/4322138"
					>CurseForge</a
				>
			</li>
			<li>
				<a
					class="link alt"
					target="_blank"
					rel="noreferrer"
					href="https://www.feed-the-beast.com/ftb-app">FTB app</a
				>
				<ul style="list-style-type: disclosure-closed;">
					<li>Browse</li>
					<li>CurseForge modpacks</li>
					<li>Search for "All the Mods 8"</li>
					<li>Don't forget to choose the right version !</li>
				</ul>
			</li>
		</ul>
	</div>
	<PlayersOnline />
</div>

<style lang="scss">
	.container {
		margin: 0 auto;
		padding: 10px;
		box-sizing: border-box;
		width: 99%;
		max-width: 850px;
	}

	.disclaimer {
		padding-top: 40px;
		font-size: 20px;
		text-align: center;
	}

	.tips {
		display: grid;
		justify-content: center;
		padding-top: 20px;
		font-size: 20px;
		text-align: left;
	}

	ul {
		margin: 0;
		padding-top: 5px;
	}

	li {
		padding-bottom: 5px;
	}

	.link {
		text-decoration: underline;
		font-weight: bold;
	}

	@media screen and (max-width: 910px) {
		.link.alt:hover::after {
			display: none;
		}
	}
</style>
