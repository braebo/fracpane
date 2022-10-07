let timer;
/**
 * Debounced event
 * @param cb Callback to run  (will cancel smoothOut)
 * @param delay delay in ms
 * @param bypass optionally cancel the debounce
 */
export const debounce = (cb, delay = 500, bypass) => {
    if (bypass)
        return;
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (bypass)
            return;
        try {
            cb();
        }
        catch (e) {
            console.warn(e);
        }
    }, delay);
};
