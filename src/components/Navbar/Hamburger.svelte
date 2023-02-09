<script lang="ts">
	import Switcher from './Switcher.svelte';

	import { ServerKind } from '../../types/global';

	import { server_name } from '../../stores/server_properties';

	export let endpoints: boolean;
	export let checked: boolean;
</script>

<div class="navbar">
	<div class="nav-container">
		<input class="checkbox" type="checkbox" bind:checked />
		<div class="hamburger-lines">
			<span class="line1" />
			<span class="line2" />
			<span class="line3" />
		</div>
		<div class="logo">
			<div>{server_name}</div>
		</div>
		<div class="menu-items">
			{#if endpoints}
				<div class="switcher">
					<Switcher left={ServerKind.Vanilla} right={ServerKind.Modded} />
				</div>
			{/if}
			<div class="links">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.navbar {
		z-index: 1;
		width: 100%;
		border-bottom: 1px solid #2f3333;
		height: 56px;

		.nav-container {
			justify-content: space-between;
			align-items: center;
			margin: 0 auto;
			display: block;
			position: relative;
			height: 56px;

			input[type='checkbox']:checked ~ .menu-items {
				transform: translateX(0);
			}

			input[type='checkbox']:checked ~ .hamburger-lines .line1 {
				transform: rotate(45deg);
			}

			input[type='checkbox']:checked ~ .hamburger-lines .line2 {
				transform: scaleY(0);
			}

			input[type='checkbox']:checked ~ .hamburger-lines .line3 {
				transform: rotate(-45deg);
			}

			.checkbox {
				position: absolute;
				display: block;
				height: 56px;
				width: 70px;
				top: 0;
				left: 0;
				z-index: 5;
				opacity: 0;
				cursor: pointer;
			}

			.hamburger-lines {
				display: block;
				height: 26px;
				width: 32px;
				position: absolute;
				top: 17px;
				left: 20px;
				z-index: 2;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.line1,
				.line2,
				.line3 {
					display: block;
					height: 4px;
					width: 100%;
					border-radius: 10px;
					background: #fff;
				}

				.line1 {
					transform-origin: 0% 0%;
					transition: transform 0.4s ease-in-out;
				}

				.line2 {
					transition: transform 0.2s ease-in-out;
				}

				.line3 {
					transform-origin: 0% 100%;
					transition: transform 0.4s ease-in-out;
				}
			}

			.logo {
				display: grid;
				justify-items: center;
				align-items: center;
				height: 100%;
				border-bottom: 1px solid #2f3333;
			}

			.menu-items {
				background-color: #000;
				height: calc(100vh - 56px);
				width: 100%;
				transform: translate(-100%);
				display: flex;
				flex-direction: column;
				transition: transform 0.3s ease-in-out;
				text-align: center;

				.switcher {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin: 0 auto;
					height: 100px;
				}

				.links {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}
		}
	}
</style>
