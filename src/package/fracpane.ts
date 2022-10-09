import type { WritableAtom } from 'nanostores'
import type { Pane } from 'tweakpane'

import { Draggable, type DragOptions } from '@neodrag/vanilla'
import { resize, type ResizeOptions } from './utils/resizable'
import { persistentAtom } from '@nanostores/persistent'
import { log } from 'fractils'

export type Position = {
	x: number
	y: number
}

// todo this class would be much better as a factory function
export class Fracpane {
	private static instances = 0
	private static stylesAdded = false
	private id: string

	container?: HTMLElement
	element?: HTMLElement
	css?: string

	pane!: Pane
	title = 'controls'

	persistent = true
	position?: Position
	positionStore?: WritableAtom<Position>

	dragInstance?: Draggable
	dragging = false
	dragTimer?: NodeJS.Timeout | null = null

	minSize = 300
	width = 420

	dragOptions: DragOptions = {
		handle: '.tp-rotv_b',
		bounds: 'body',
		onDrag: () => {
			this.dragging = true
		},

		// Prevent dragging from collapsing gui
		onDragEnd: (e) => {
			if (this.dragging) {
				if (this.pane) this.pane.expanded = !this.pane.expanded

				this.dragTimer = setTimeout(() => {
					this.dragging = false

					// Update the position in localstorage if persistent
					this.positionStore?.set({
						x: e.offsetX,
						y: e.offsetY,
					})

					// Fixes bug where dragInstance.options.y is not updated
					this.dragInstance?.updateOptions({ position: { x: e.offsetX, y: e.offsetY } })
				}, 300)
			}
		},
	}

	resizerLeft?: ReturnType<typeof resize>
	resizerRight?: ReturnType<typeof resize>

	resizeOptions: ResizeOptions = {
		minSize: this.minSize,
		initialWidth: this.width + 'px',
	}

	windowWidth = 0
	windowHeight = 0

	disposing = false

	constructor(public options: Partial<Fracpane>) {
		Object.assign(this, options)

		if (!Fracpane.stylesAdded) {
			this.addStyles()
			Fracpane.stylesAdded = true
		}

		Fracpane.instances++

		if (!options.title && Fracpane.instances > 1) this.title += `_${Fracpane.instances}`

		this.id = `fracpane_${Fracpane.instances}_${this.title.trim().replace(/\s/g, '_')}`

		this.position ??= { x: 10, y: 10 }

		if (this.persistent) {
			this.positionStore = persistentAtom<Position>(`${this.id}_position`, this.position, {
				encode: JSON.stringify,
				decode: JSON.parse,
			})
			this.position = this.positionStore.get()
		}
	}

	public async init() {
		if (typeof window === 'undefined') return console.warn('skipping fracpane server-side')

		this.windowWidth = window.innerWidth
		this.windowHeight = window.innerHeight

		const needsMounting = !this.container

		this.container ??= document.createElement('div')
		this.container.classList.add(this.id + '_container')
		this.container.classList.add('fracpane')

		this.element ??= document.createElement('div')
		this.element.classList.add(this.id + '_element')

		const dragOptions = this.dragOptions
		// Update the position from localstorage if it exists
		if (this.persistent) this.dragOptions.position = this.position
		this.dragInstance = new Draggable(this.container, dragOptions)

		this.resizerLeft = resize(this.container, {
			id: this.id,
			side: 'left',
			gutterSize: '5px',
			initialWidth: this.width + 'px',
			...this.resizeOptions,
		})

		// Add a right resize handle
		this.resizerRight = resize(this.container, {
			id: this.id,
			side: 'right',
			gutterSize: '5px',
			initialWidth: this.width + 'px',
			...this.resizeOptions,
		})

		let updatePositionTimer: NodeJS.Timeout
		this.resizerLeft.onResize.subscribe(({ delta, direction }) => {
			if (this.dragInstance) {
				const currentPosition = {
					x: this.dragInstance.options.position?.x ?? 0,
					y: this.dragInstance.options.position?.y ?? 0,
				}
				if (direction === 'horizontal') {
					const newPosition = { x: currentPosition.x + delta, y: currentPosition.y }
					this.dragInstance.updateOptions({ position: newPosition })
				}
				if (direction === 'vertical') {
					const newPosition = { x: currentPosition.x, y: currentPosition.y + delta }
					this.dragInstance.updateOptions({ position: newPosition })
				}
				clearTimeout(updatePositionTimer)
				updatePositionTimer = setTimeout(() => {
					this.positionStore?.set({
						x: this.dragInstance?.options.position?.x ?? 0,
						y: this.dragInstance?.options.position?.y ?? 0,
					})
				}, 100)
			}
		})

		const Pane = (await import('tweakpane')).Pane

		this.pane = new Pane({
			title: this.title,
			container: this.container,
			expanded: true,
		})

		// Register plugins just in case
		const plugins = await import('@tweakpane/plugin-essentials')
		this.pane.registerPlugin(plugins)

		this.container.appendChild(this.pane.element)

		if (needsMounting) document.body.appendChild(this.container)

		// MutationRecord.removedNodes
		const onDestroy: MutationCallback = (mutationList, observer) => {
			mutationList.forEach((mutation) => {
				if (mutation.removedNodes.length) {
					mutation.removedNodes.forEach((node) => {
						if (node === this.container) {
							this.maybeDispose()
							observer.disconnect()
						}
					})
				}
			})
		}

		const observer = new MutationObserver(onDestroy)
		observer.observe(document.body, { childList: true })

		this.dragInstance?.updateOptions({ position: this.position })

		window.addEventListener('beforeunload', this.maybeDispose)
		window.addEventListener('resize', this.onWindowResize)

		this.onWindowResize()

		return this
	}

	dispose() {
		this.disposing = true
		log('disposing', this.id, 'sandybrown')
		window.removeEventListener('beforeunload', this.maybeDispose)
		window.removeEventListener('resize', this.onWindowResize)
		this.resizerLeft?.destroy()
		this.resizerRight?.destroy()
		this.dragInstance?.destroy()
		this.pane?.dispose()
		this.element?.remove()
		this.container?.remove()
		Fracpane.instances--
	}

	maybeDispose = () => {
		if (this.disposing) return
		this.dispose()
	}

	async addStyles() {
		const styles = import.meta.glob('./styles.css', { as: 'raw' })
		const styleTag = document.createElement('style')
		styleTag.innerHTML = await styles['./styles.css']()
		document.head.appendChild(styleTag)
	}

	onWindowResize = () => {
		if (this.dragInstance) {
			const lastWindowWidth = this.windowWidth
			const lastWindowHeight = this.windowHeight
			const currentWindowWidth = window.innerWidth
			const currentWindowHeight = window.innerHeight
			const currentWidth = this.container?.clientWidth ?? this.minSize
			const currentHeight = this.container?.clientHeight ?? this.minSize
			const { x, y } = this.dragInstance.options.position ?? { x: 0, y: 0 }

			// Find the ratio between the last window size and the current window size
			const widthRatio = currentWindowWidth / lastWindowWidth
			const heightRatio = currentWindowHeight / lastWindowHeight

			// Multiply the current position by the ratio to get the new position
			let newX = x * widthRatio
			let newY = y * heightRatio

			// Keep the container locked to the edge if it's placed close to the edge
			// On the left
			const lockThreshold = 50
			if (x < lockThreshold) newX = x
			if (y < lockThreshold) newY = y
			// On the right
			if (x > lastWindowWidth - currentWidth - lockThreshold) {
				// Stay locked to the right, but maintain the current distance from the right edge
				const distanceFromRightEdge = lastWindowWidth - x - currentWidth
				newX = currentWindowWidth - distanceFromRightEdge - currentWidth
			}
			if (y > lastWindowHeight - currentHeight - lockThreshold) {
				newY = currentWindowHeight - currentHeight
			}

			// If the new position is outside the window, move it to the edge
			if (newX > currentWindowWidth - currentWidth) {
				newX = currentWindowWidth - currentWidth
			}
			if (newY > currentWindowHeight - currentHeight) {
				// If the new position is outside the window, move the bottom of the container to the bottom of the window
				newY = currentWindowHeight - currentHeight
			}

			// Update the position
			this.dragInstance.updateOptions({ position: { x: newX, y: newY } })

			// Update the window size
			this.windowWidth = currentWindowWidth
			this.windowHeight = currentWindowHeight
		}
	}
}

export const fracpane = async (options?: Partial<Fracpane>): Promise<Fracpane> => {
	return (await new Fracpane(options ?? {}).init()) as Fracpane
}
