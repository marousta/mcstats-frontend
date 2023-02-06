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
		mc_infos = value[ServerKind.Vanilla];
	});

	onMount(() => {
		mc_infos = get(mcInfos)[ServerKind.Vanilla];
	});
</script>

<div
	class="container"
	in:fly={{ x: -200, duration: 200, delay: 200 }}
	out:fly={{ x: -200, duration: 200 }}
>
	<div class="disclaimer">
		Compatible with Minecraft <b>Java Edition</b>
		{#if mc_infos && mc_infos.java}
			<b>{mc_infos.java.version}</b>
		{/if}
		and <b title="kinda">Bedrock Edition</b>
		{#if mc_infos && mc_infos.bedrock}
			<b>{mc_infos.bedrock.version}</b>
		{/if}
	</div>
	<div class="tips">
		<p>
			I highly recommend you to play <b>Java Edition</b> with
			<a
				class="link"
				rel="noreferrer"
				href="https://github.com/CaffeineMC/sodium-fabric"
				target="_blank">Sodium</a
			> for maximum performance
		</p>
		<p>
			You can get a preconfigured version with Sodium and Shaders <a
				class="link alt"
				href="/multimc">here</a
			>
		</p>
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
		padding-top: 20px;
		font-size: 20px;
		text-align: center;
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
