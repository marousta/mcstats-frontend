<script lang="ts">
	export let status: number;
	export let message: string = 'error';
</script>

<div class="center">
	<div class="error">
		<span class="status">{status}</span>
		<div class="message">
			<h1>{message}</h1>
		</div>
	</div>
</div>

<style lang="scss">
	.center {
		display: grid;
		align-items: center;
		justify-items: center;
		height: 100vh;
	}

	.error {
		display: flex;
		align-items: center;
		max-width: 32rem;
		margin: 0 1rem;

		.status {
			font-weight: 200;
			font-size: 3rem;
			line-height: 1;
			position: relative;
			top: -0.05rem;
		}

		.message {
			border-left: 1px solid #ccc;
			padding: 0 0 0 1rem;
			margin: 0 0 0 1rem;
			min-height: 2.5rem;
			display: flex;
			align-items: center;

			h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}
		}
	}
</style>
