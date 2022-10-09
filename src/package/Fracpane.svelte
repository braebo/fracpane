<script lang="ts">
	import { fracpane as fp, type Fracpane } from './fracpane.js'
	import { onMount, onDestroy } from 'svelte'

	export let fracpane: Awaited<Fracpane>
	export let title = 'fracpane'

	onMount(async () => {
		fracpane = await fp({ title })
	})

	onDestroy(() => {
		fracpane?.dispose()
	})
</script>
