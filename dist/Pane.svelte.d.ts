import { SvelteComponentTyped } from "svelte";
declare const __propDef: any;
export declare type PaneProps = typeof __propDef.props;
export declare type PaneEvents = typeof __propDef.events;
export declare type PaneSlots = typeof __propDef.slots;
/**
 * - A themed tweakpane gui with drag and drop support.
 * @prop {string} [title] - The title of the gui.
 */
export default class Pane extends SvelteComponentTyped<PaneProps, PaneEvents, PaneSlots> {
    get dragOptions(): any;
    get resizeOptions(): any;
}
export {};
