<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { ServerKind } from '../../types/global';
	import { pageStatus, serverKind } from '../../stores/stores';

	export let left: string;
	export let right: string;

	let input: HTMLInputElement;
	let checked: boolean = $serverKind === ServerKind.Modded;

	left = left.charAt(0).toUpperCase() + left.slice(1);
	right = right.charAt(0).toUpperCase() + right.slice(1);

	async function preserveScroll(k: ServerKind) {
		const old = $serverKind;
		console.log({ old, $serverKind, $pageStatus });
		$serverKind = k;

		if ($pageStatus === 404) {
			await goto(`/${$serverKind}`, {
				replaceState: true,
			});
			return;
		}

		await goto($page.url.pathname.replace(old, k), {
			noScroll: true,
		});
	}

	function check() {
		if (input.checked) {
			preserveScroll(ServerKind.Modded);
		} else {
			preserveScroll(ServerKind.Vanilla);
		}
	}

	$: {
		checked = $serverKind === ServerKind.Modded;
	}
</script>

<div class="button r">
	<input type="checkbox" class="checkbox" bind:this={input} on:input={check} {checked} />
	<div class="knobs" data-left={left} data-right={right} />
	<div class="layer" />
</div>

<style lang="scss">
	* {
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	*:focus {
		outline: none;
	}

	.button {
		z-index: 10;
		width: 90px;
		height: 36px;
		overflow: hidden;
		transform: scale(1);

		&.r,
		&.r .layer {
			border-radius: 100px;
		}

		.checkbox {
			position: relative;
			width: 100%;
			height: 100%;
			padding: 0;
			margin: 0;
			opacity: 0;
			cursor: pointer;
			z-index: 3;
		}

		.knobs,
		.layer {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		.layer {
			width: 100%;
			background-color: #222222;
			transition: 0.3s ease all;
			z-index: 1;
		}

		.knobs {
			z-index: 2;

			&:before,
			&:after {
				content: '';
				position: absolute;
				top: 4px;
				left: 4px;
				width: 50px;
				height: 10px;
				color: #000;
				font-size: 10px;
				font-weight: bold;
				text-align: center;
				line-height: 1;
				padding: 9px 4px;
				background-color: #fff;
				border-radius: 20px;
				transition: 0.3s ease all;
			}

			&:before {
				content: attr(data-left);
			}

			&:after {
				content: attr(data-right);
				right: -60px;
				left: auto;
			}
		}

		.checkbox:checked + .knobs:before {
			left: -60px;
		}

		.checkbox:checked + .knobs:after {
			right: 4px;
		}
	}

	// @media screen and (max-width: 800px) {
	// 	.button {
	// 		position: fixed;
	// 		right: 20px;
	// 		bottom: 30px;
	// 	}
	// }
</style>
