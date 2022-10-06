<br>

This package isn't really intended for public use. But if you really want to, here is some info:

## Install

`pnpm i -D fractalhq/fracpane`

<br>

## Example

This is how I use it in a `.svelte` file. Not ideal... but it works.

```svelte
<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { fracpane } from '$package'

	let gui: Awaited<ReturnType<typeof fracpane>>

	onMount(async () => {
		gui = await fracpane()

		const pane = gui.pane
	})

	onDestroy(() => {
		gui?.dispose()
	})
</script>
```

## API

Any of these values can be provided as options and accessed anytime.

See [@neodrag](https://github.com/PuruVJ/neodrag) for [`Draggable`](https://github.com/PuruVJ/neodrag/blob/main/packages/svelte/src/index.ts#L189) and [`DragOptions`](https://github.com/PuruVJ/neodrag/tree/main/packages/vanilla#options) types.

```rust
container: HTMLElement

element: HTMLElement

css: string

pane: Pane

title = 'controls'

persistent = true
position: { x: number, y: number }

dragInstance: Draggable
dragTimer: NodeJS.Timeout | null = null

dragOptions: DragOptions

resizerLeft: {
	onResize: (delta) => void,
	destroy: () => void
}
resizerRight: {
	onResize: (delta) => void,
	destroy: () => void
}

resizeOptions: ResizeOptions {
	/**
	 * The size of the resize handle in pixels.
	 * @default '5px'
	 */
	gutterSize?: number | string
	/**
	 * Number of `vw` units (relative % of the viewport).
	 * @default 15
	 */
	minSize?: number
	/**
	 * Number of `vw` units (relative % of the viewport).
	 * @default 75
	 */
	maxSize?: number
	/**
	 * Use a visible or invisible gutter.
	 * @default true
	 */
	visible?: boolean
	/**
	 * Gutter css color (if visible = `true`)
	 * @default 'transparent'
	 */
	color?: string
	/**
	 * Persist width in local storage.
	 * @default true
	 */
	persistent?: boolean
	/**
	 * The key to use for local storage.  Important if you have multiple resizable panes.
	 * @default 'fracpane_size'
	 */
	id?: string
}
```

<br>
<br>
<br>
