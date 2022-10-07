<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import Orbs, { _ } from '$lib/Orbs.svelte'
	import { fracpane } from 'fracpane'

	let gui: Awaited<ReturnType<typeof fracpane>>

	onMount(async () => {
		gui = await fracpane({
			title: 'fracpane',
			position: { x: window.innerWidth / 2 - 210, y: 30 },
		})

		const pane = gui.pane

		for (const key of Object.keys(_)) {
			switch (key) {
				case 'orbs':
					pane.addInput(_, key, { min: 0, max: 100, step: 1 })
					break
				case 'size':
					pane.addInput(_, key, { min: 0, max: 20, step: 0.001 })
					break
				case 'brightness':
					pane.addInput(_, key, { min: 0, max: 2, step: 0.001 })
					break
				case 'a1':
					pane.addInput(_, key, { min: 0, max: 10, step: 0.001 })
					break
				case 'a2':
					pane.addInput(_, key, { min: 0, max: 10, step: 0.001 })
					break
				case 'speed':
					pane.addInput(_, key, { min: 0, max: 2, step: 0.001 })
					break
				case 'mid':
					break
				default:
					// @ts-ignore
					pane.addInput(_, key, { min: 0, max: 200, step: 0.001 })
					break
			}
		}
	})

	onDestroy(() => {
		gui?.dispose()
	})
</script>

<Orbs />

<!--
<h1>Fracpane</h1>

<style>
	h1 {
		text-align: center;
		font-variation-settings: 'wght' 300;
	}
</style>
-->
