<script lang="ts">
	// From https://svelte.dev/repl/26eb44932920421da01e2e21539494cd?version=3.55.1

	import { onMount } from 'svelte';

	export let query: string;

	let mql: MediaQueryList;
	let mqlListener: any = (v: MediaQueryList) => {};
	let wasMounted = false;
	let matches = false;

	onMount(() => {
		wasMounted = true;
		return () => {
			removeActiveListener();
		};
	});

	$: {
		if (wasMounted) {
			removeActiveListener();
			addNewListener(query);
		}
	}

	function addNewListener(query: string) {
		mql = window.matchMedia(query);
		mqlListener = (v: MediaQueryList) => (matches = v.matches);
		mql.addEventListener('change', mqlListener);
		matches = mql.matches;
	}

	function removeActiveListener() {
		if (mql && mqlListener) {
			mql.removeEventListener('change', mqlListener);
		}
	}
</script>

<slot {matches} />
