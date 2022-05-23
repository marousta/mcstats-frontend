<script lang="ts">
	import { onMount } from 'svelte';
	import { modals, ModalType, type ModalData } from '$stores/modal';

	export let data: ModalData;
	// export let type: string;

	let timeout: string | null = null;
	let canRender: boolean = false;

	let color: string;
	onMount(() => {
		switch (data.type) {
			case ModalType.Error:
				color = 'error';
				break;
			case ModalType.Success:
				color = 'success';
				break;
			case ModalType.Warning:
				color = 'warning';
				break;
			default:
				color = 'helper';
				break;
		}
		canRender = true;
	});

	function remove() {
		timeout = 'timeout';
		setTimeout(() => {
			modals.update((n) => n.filter((modal) => modal.id !== data.id));
		}, 250);
	}

	setTimeout(() => {
		remove();
	}, 3500);
</script>

{#if canRender}
	<div class="modal {color} {timeout}" on:click={remove}>
		<div class="text">{data.id}</div>
	</div>
{/if}

<!-- let div = document.createElement("div")
div.classList.add("modal")
div.classList.add(type)
div.setAttribute("data-id", id)

let textDiv = document.createElement("div")
textDiv.classList.add("text")
textDiv.innerText = text

let codeDiv = document.createElement("div")
codeDiv.classList.add("code")
codeDiv.innerText = code ? code : ""

div.appendChild(textDiv)
div.appendChild(codeDiv)

this.array.push(div)
div.addEventListener("click", () => {
	div.classList.add("timeout")
	setTimeout(() => {
		this.remove(div, id)
	}, 500)
})
setTimeout(() => {
	div.classList.add("timeout")
}, 3450)
setTimeout(() => {
	this.remove(div, id)
}, 4000)

modalContainer.appendChild(div)
modalContainer.scrollTo(0, 10000) -->
<style lang="scss">
	$infos_width: 200px;

	.modal {
		position: relative;
		right: 0;
		width: $infos_width;
		height: 100px;
		background-color: #fff;
		color: #000;
		margin-right: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		cursor: pointer;
		transition: 0.2s;
		animation: infos-in 0.25s linear;

		&:hover {
			filter: brightness(1.1);
			transition: 0.2s;
		}

		&:before {
			content: 'hmmmmmmm';
			position: absolute;
			top: 5px;
			left: 5px;
			color: #000;
			border-bottom: 1px solid #000;
			font-weight: bold;
		}

		&.helper {
			background-color: #2b6cff;

			&:before {
				content: 'Infos';
			}
		}

		&.success {
			background-color: #3eda00;

			&:before {
				content: 'Infos';
			}
		}

		&.warning {
			background-color: #ff9d37;

			&:before {
				content: 'Warning';
			}
		}

		&.error {
			background-color: #ff3737;

			&:before {
				content: 'Error';
			}
		}

		&.timeout {
			animation: infos-out 0.25s linear;
			right: calc(-#{$infos_width} - 10px);

			&:after {
				width: 100%;
			}
		}

		&:after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			height: 5px;
			width: 0%;
			color: #000;
			background-color: #000;
			animation: infos-timeout 3s 0.5s linear;
		}

		.text {
			position: absolute;
			top: 30px;
			left: 5px;
		}
	}

	@keyframes infos-in {
		from {
			right: -$infos_width;
		}
		to {
			right: 0;
		}
	}

	@keyframes infos-out {
		from {
			right: 0;
		}
		to {
			right: -$infos_width;
		}
	}

	@keyframes infos-timeout {
		from {
			width: 0%;
		}
		to {
			width: 100%;
		}
	}
</style>
