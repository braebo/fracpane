/// <reference types="node" />
import type { WritableAtom } from 'nanostores';
import type { Pane } from 'tweakpane';
import { Draggable, type DragOptions } from '@neodrag/vanilla';
import { resize, type ResizeOptions } from './utils/resizable';
export declare type Position = {
    x: number;
    y: number;
};
export declare class Fracpane {
    options: Partial<Fracpane>;
    private static instances;
    private static stylesAdded;
    private id;
    container?: HTMLElement;
    element?: HTMLElement;
    css?: string;
    pane: Pane;
    title: string;
    persistent: boolean;
    position?: Position;
    positionStore?: WritableAtom<Position>;
    dragInstance?: Draggable;
    dragging: boolean;
    dragTimer?: NodeJS.Timeout | null;
    minSize: number;
    width: number;
    dragOptions: DragOptions;
    resizerLeft?: ReturnType<typeof resize>;
    resizerRight?: ReturnType<typeof resize>;
    resizeOptions: ResizeOptions;
    windowWidth: number;
    windowHeight: number;
    disposing: boolean;
    constructor(options: Partial<Fracpane>);
    init(): Promise<void | this>;
    dispose(): void;
    maybeDispose: () => void;
    addStyles(): Promise<void>;
    onWindowResize: () => void;
}
export declare const fracpane: (options?: Partial<Fracpane>) => Promise<Fracpane>;
