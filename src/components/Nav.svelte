<script lang="ts">
	export let siteName: string;
</script>

<div class="topbar">
	<a class="title" href="/">{siteName}</a>
	<div class="navigation">
		<a href="/">Home</a>
		<a href="/graphs">Graphs</a>
		<a href="/dynmap">Dynmap</a>
		<a href="/explore">Explore</a>
	</div>
</div>

<style lang="scss">
	.topbar {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		width: 100vw;
		height: 56px;
		border-bottom: 1px solid #2f3333;

		.title {
			display: grid;
			place-items: center;
			min-width: 300px;
			font-size: 20px;
		}

		.navigation {
			position: absolute;
			right: 0;
			padding-right: 40px;

			a {
				&:not(.title) {
					padding-left: 5px;
					padding-right: 5px;
				}
			}
		}
	}

	@media screen and (max-width: 800px) {
		.title {
			color: transparent;
		}

		.navigation {
			display: flex;
			justify-content: center;
			font-size: 18px;
			padding-right: 0 !important;
			width: 100%;
		}
	}
</style>
