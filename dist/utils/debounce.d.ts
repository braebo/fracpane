/**
 * Debounced event
 * @param cb Callback to run  (will cancel smoothOut)
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 */
export declare const debounce: (cb: () => void, delay?: number, bypass?: boolean) => void;
