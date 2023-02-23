<script lang="ts">
	import { fly } from 'svelte/transition';

	import PlayersOnline from '../Players/PlayersOnline.svelte';

	import { ServerKind } from '../../types/global';
	import { mcInfos } from '../../stores/stores';

	let modpack = $mcInfos[ServerKind.Modded].java.motd;

	$: {
		modpack = $mcInfos[ServerKind.Modded].java.motd;
	}
</script>

<div
	class="container"
	in:fly={{ x: 200, duration: 200, delay: 200 }}
	out:fly={{ x: 200, duration: 200 }}
>
	<div class="disclaimer">
		Modpack <b>{modpack}</b> on Minecraft
		{#if $mcInfos[ServerKind.Modded].java}
			<b>{$mcInfos[ServerKind.Modded].java.version}</b>
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
