<script>
	import { page } from '$app/stores';
	import Error from '../components/Error.svelte';
</script>

<Error status={$page.status} message={$page.error?.message} />
