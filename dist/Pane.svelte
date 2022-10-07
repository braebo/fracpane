<!--
	@component - A themed tweakpane gui with drag and drop support.
	@prop {string} [title] - The title of the gui.
 -->
 <script>import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { resize } from './utils/resizable';
import { draggable } from '@neodrag/svelte';
import { onMount, onDestroy } from 'svelte';
import { Pane } from 'tweakpane';
export let title = 'fracpane';
export let top = '';
export let right = '';
export let bottom = '';
export let left = '';
export let css = '';
const container = document?.createElement('div');
let element;
export let pane = new Pane({
    title,
    container,
    expanded: true
});
pane.registerPlugin(EssentialsPlugin);
// Set default positions if none are specified.
if (!top && !right && !bottom && !left && !css) {
    top = '1rem';
    right = '1rem';
}
// GUI Dragging
let dragging = false;
let dragTimer;
export const dragOptions = {
    handle: '.tp-rotv_b',
    bounds: 'body',
    onDrag: () => {
        dragging = true;
    },
    // Prevent dragging from collapsing gui
    onDragEnd: () => {
        if (dragging) {
            pane.expanded = !pane.expanded;
            dragTimer = setTimeout(() => {
                dragging = false;
            }, 500);
        }
    }
};
export const resizeOptions = {};
onMount(() => {
    container.appendChild(pane.element);
});
onDestroy(() => {
    clearTimeout(dragTimer);
    pane.dispose();
});
</script>

<div
	bind:this={element}
	class="fracpane"
	style:top
	style:right
	style:bottom
	style:left
	style={css}
	use:draggable={dragOptions}
	use:resize={{ side: 'left', gutterSize: '5px' }}
/>

<style>.fracpane {
  position: absolute;
  z-index: 10;
  width: 500px;
  height: -moz-fit-content;
  height: fit-content;
  max-height: 90vh;
  contain: none;
  overflow: hidden;
  -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
  --tp-base-background-color: hsla(237, 8%, 9%, 0.9);
  --tp-base-shadow-color: hsla(0, 0%, 47%, 0.2);
  --tp-button-background-color: hsl(221, 18%, 18%);
  --tp-button-background-color-focus: hsl(224 19% 12%);
  --tp-button-background-color-active: hsl(225 14% 19%);
  --tp-button-background-color-hover: hsl(225 14% 15%);
  --tp-button-foreground-color: hsla(237, 2%, 49%, 1);
  --tp-container-background-color: hsl(242 6% 27% / 30%);
  --tp-container-background-color-active: hsl(224 18% 20%);
  --tp-container-background-color-focus: hsl(224 18% 20%);
  --tp-container-background-color-hover: hsl(224 18% 20%);
  --tp-container-foreground-color: hsl(0 0% 100% / 66%);
  --tp-groove-foreground-color: hsla(209, 0%, 60%, 0.2);
  --tp-input-background-color: hsl(0 0% 0% / 30%);
  --tp-input-background-color-active: rgba(38, 38, 38, 0.3);
  --tp-input-background-color-focus: rgba(26, 26, 26, 0.3);
  --tp-input-background-color-hover: rgba(13, 13, 13, 0.3);
  --tp-input-foreground-color: hsla(215, 0%, 100%, 0.5);
  --tp-label-foreground-color: hsla(0, 0%, 68%, 0.5);
  --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-monitor-foreground-color: hsl(0 0% 100% / 45%);
}
.fracpane :global(.tp-lblv_l) {
  max-width: 100px !important;
}
.fracpane :global(.tp-rotv) {
  height: var(--gui-height, auto);
  max-height: var(--gui-max-height, 90vh);
  overflow-y: scroll;
  overflow-x: hidden;
}
.fracpane :global(.tp-rotv)::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.fracpane :global(.tp-rotv)::-webkit-scrollbar-thumb {
  background-color: hsla(0deg, 0%, 33%, 0.2);
}
.fracpane :global(.tp-rotv)::-webkit-scrollbar-track {
  background-color: var(--tp-base-background-color);
  background-color: rgba(var(--light-d-rgb), 0.1);
}
.fracpane :global(.tp-rotv)::-webkit-scrollbar-corner {
  background-color: var(--tp-base-background-color);
  background-color: rgba(var(--light-d-rgb), 0.1);
}
.fracpane :global(.tp-txtv_k::before) {
  background-color: hsl(237deg, 100%, 92%) !important;
  width: 7px !important;
}
.fracpane :global(.tp-lblv_v) {
  flex: 1;
}
.fracpane :global(.tp-rsltxtv_t) {
  max-width: 123px;
}
.fracpane :global(.tp-sprv) {
  margin: 10px 6px !important;
  opacity: 0.25;
}
.fracpane :global(.tp-fldv-expanded > .tp-brkv) {
  height: -moz-fit-content !important;
  height: fit-content !important;
}</style>
