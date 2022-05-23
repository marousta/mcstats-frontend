<script>
	import { server_name } from '$stores/server_properties';
</script>

<svelte:head>
	<title>About - {server_name}</title>
</svelte:head>

<div class="about">
	<p>
		Charts made using <a href="https://www.chartjs.org/" title="It sucks">Chart.js</a>
	</p>
	<p>
		Dynamic Minecraft map made using <a href="https://github.com/webbukkit/dynmap" target="_blank"
			>Dynmap</a
		>
		&nbsp;|&nbsp; Frontend by
		<a href="https://github.com/JLyne/LiveAtlas" target="_blank">LiveAtlas</a>
	</p>
	<p>
		Dynamic Minecraft map made using <a href="https://github.com/webbukkit/dynmap" target="_blank"
			>Dynmap</a
		>
		&nbsp;|&nbsp; Frontend by
		<a href="https://github.com/JLyne/LiveAtlas" target="_blank">LiveAtlas</a>
	</p>
	<p>
		3D Minecraft map made using <a
			href="https://github.com/BlueMap-Minecraft/BlueMap"
			target="_blank">BlueMap</a
		>
	</p>
	<p>
		Java/Bedrock compatibility provided by <a href="https://geysermc.org/" target="_blank"
			>GeyserMC</a
		>
	</p>
</div>

<style>
	.about {
		display: grid;
		place-items: center;
		padding-top: 40px;
	}
	a {
		font-weight: bold;
	}
</style>
