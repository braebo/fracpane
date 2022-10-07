import { Subject } from 'rxjs';
export interface ResizeOptions {
    side?: 'left' | 'right' | 'top' | 'bottom';
    /**
     * The starting width of the element.
     * @default 420
     */
    initialWidth?: string;
    /**
     * The size of the resize handle in pixels.
     * @default '5px'
     */
    gutterSize?: number | string;
    /**
     * The minimum size of the element in px.
     * @default 50
     */
    minSize?: number;
    /**
     * The maximum size of the element in px.
     * @default 1000
     */
    maxSize?: number;
    /**
     * Use a visible or invisible gutter.
     * @default true
     */
    visible?: boolean;
    /**
     * Gutter css color (if visible = `true`)
     * @default 'transparent'
     */
    color?: string;
    /**
     * Persist width in local storage.
     * @default true
     */
    persistent?: boolean;
    /**
     * The key to use for local storage.  Important if you have multiple resizable panes.
     * @default 'fracpane_size'
     */
    id?: string;
}
export declare const resize: (node: HTMLElement, options: ResizeOptions) => {
    onResize: Subject<{
        delta: number;
        direction: string;
    }>;
    destroy: () => void;
};
