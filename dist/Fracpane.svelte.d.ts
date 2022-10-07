/** @typedef {typeof __propDef.props}  FracpaneProps */
/** @typedef {typeof __propDef.events}  FracpaneEvents */
/** @typedef {typeof __propDef.slots}  FracpaneSlots */
export default class Fracpane extends SvelteComponentTyped<{}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type FracpaneProps = typeof __propDef.props;
export type FracpaneEvents = typeof __propDef.events;
export type FracpaneSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {};
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
