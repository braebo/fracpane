import { persistentAtom } from '@nanostores/persistent';
import { debounce } from './debounce';
import { Subject } from 'rxjs';
const px = (size) => {
    if (typeof size === 'number')
        return `${size}px`;
    else
        return size;
};
export const resize = (node, options) => {
    const { side = 'left', initialWidth = '420px', gutterSize = '3px', minSize = 50, maxSize = 1000, persistent = true, visible = true, color = 'transparent', id = 'fracpane', } = options;
    const onResize = new Subject();
    const sizeStore = persistentAtom(id + '_size', initialWidth, {
        encode: JSON.stringify,
        decode: JSON.parse,
    });
    const grabber = document.createElement('div');
    grabber.classList.add('resize-grabber');
    node.appendChild(grabber);
    node.style.cssText += `padding-${side}: ${px(gutterSize)} !important;`;
    if (persistent) {
        const persistentSize = sizeStore.get();
        node.style.width = persistentSize;
    }
    const direction = side === ('top' || 'bottom') ? 'vertical' : 'horizontal';
    const width = direction === 'horizontal' ? px(gutterSize) : px(node.scrollWidth);
    const height = direction === 'horizontal' ? px(node.clientHeight + node.scrollTop) : px(gutterSize);
    direction === 'horizontal' ? (grabber.style.top = '0') : (grabber.style.left = '0');
    const cursor = (grabber.style.cursor = direction === 'horizontal' ? 'ew-resize' : 'ns-resize');
    grabber.classList.add('grabber_' + side);
    grabber.style.cssText += `
		${side}: 0;
		width: ${width};
		height: ${height};
		background: ${visible ? color : 'transparent'};
		padding: ${px(gutterSize)};
		border-${direction === 'horizontal' ? 'top' : 'left'}-${side}-radius: 3px;
		border-${direction === 'horizontal' ? 'bottom' : 'right'}-${side}-radius: 3px;
		position: absolute;
		display: flex;
		flex-grow: 1;
		z-index: -1;
		cursor: ${cursor};
	`;
    const onGrab = (e) => {
        grabber.style.cursor = 'grabbing';
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
			* { cursor: grabbing !important; }
		`;
        document.head.appendChild(styleEl);
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', (e) => onUp(e, styleEl), { once: true });
    };
    grabber.addEventListener('mousedown', onGrab);
    node.addEventListener('mouseover', updateHeight);
    const onMove = (e) => {
        const startWidth = node.offsetWidth;
        const startHeight = node.offsetHeight;
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        const minSizePx = minSize;
        const maxSizePx = maxSize;
        let newWidth = 0;
        if (side === 'left')
            newWidth = startWidth - deltaX;
        else if (side === 'right')
            newWidth = startWidth + deltaX;
        const newHeight = startHeight + deltaY;
        if (direction === 'horizontal') {
            if (newWidth < minSizePx)
                return;
            if (maxSizePx && newWidth > maxSizePx)
                return;
            node.style.width = `${newWidth}px`;
            onResize.next({ delta: deltaX, direction: 'horizontal' });
        }
        else {
            if (newHeight < minSizePx)
                return;
            if (maxSizePx && newHeight > maxSizePx)
                return;
            node.style.height = `${newHeight}px`;
            onResize.next({ delta: deltaY, direction: 'vertical' });
        }
        debounce(() => {
            sizeStore.set(px(node.offsetWidth));
        }, 50);
    };
    const onUp = (e, styleEl) => {
        document.removeEventListener('mousemove', onMove);
        // Remove the cursor style element.
        if (styleEl)
            document.head.removeChild(styleEl);
        grabber.style.cursor = cursor;
    };
    document.addEventListener('mouseup', onUp);
    function updateHeight() {
        const node_rect = node.getBoundingClientRect();
        direction === 'horizontal'
            ? (grabber.style.height = px(Math.min(node.scrollHeight, node_rect.height)))
            : (grabber.style.width = px(Math.min(node.scrollWidth, node_rect.width)));
    }
    setTimeout(updateHeight, 20);
    // Add a resize observer to update the height of the grabber.
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(node);
    return {
        onResize,
        destroy: () => {
            resizeObserver.disconnect();
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            node.removeEventListener('mouseover', updateHeight);
            grabber.removeEventListener('mousedown', onGrab);
            grabber.remove();
        },
    };
};
