<script lang="ts">
	import { fracpane as fp } from './fracpane.js'
	import { onMount, onDestroy } from 'svelte'

	export let fracpane: Awaited<ReturnType<typeof fp>>
	export let title = 'fracpane'

	onMount(async () => {
		fracpane = await fp({ title })
	})

	onDestroy(() => {
		fracpane?.dispose()
	})
</script>
