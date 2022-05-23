<script lang="ts">
	import { modals, ModalType, type ModalData } from '$stores/modal';
	import Modal from '$components/Modal/Modal.svelte';

	let lModals: ModalData[] = [];
	modals.subscribe((value) => {
		lModals = value;
	});
</script>

<div class="modal-container">
	{#each lModals as modal}
		<Modal data={modal} />
	{/each}
</div>

<style lang="scss">
	.modal-container {
		z-index: 20;
		position: absolute;
		right: 0;
		top: 57px;
		overflow: hidden;
		max-height: calc(100vh - 57px);
	}
</style>
