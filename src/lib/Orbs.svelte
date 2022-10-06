<script lang="ts" context="module">
	import { tweened } from 'svelte/motion'
	let count = 10
	export const _ = {
		orbs: 50,
		size: 5,
		a1: 0.1,
		a2: 0.5,
		width: count * 10,
		height: count * 10,
		speed: 0.2,
		mid: count * 5,
		brightness: 1,
	}
	const a1t = tweened(_.a1, { duration: 500 })
	const a2t = tweened(_.a2, { duration: 500 })
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	$: time = 1
	$: snake = circle()
	let circle = () => {
		let arr = [] as number[][]
		for (let i = 0; i < _.orbs; i++) {
			arr = [
				...arr,
				[
					(Math.sin((i / Math.PI) * $a1t - time) / Math.PI) * _.width + _.mid,
					(Math.cos((i / Math.PI) * $a2t - time) / Math.PI) * _.height + _.mid,
				],
			]
		}
		return arr
	}
	let interval: NodeJS.Timeout
	function animate() {
		requestAnimationFrame(() => {
			$a1t = _.a1
			$a2t = _.a2
			requestAnimationFrame(() => {
				time += _.speed / 10
				snake = circle()
				animate()
			})
		})
	}
	onMount(() => {
		animate()
	})
	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<div class="orbs">
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<svg width="95vw" height="60vh">
		<svg id="die" viewBox="0 0 100 100">
			<g transform="rotate({0})">
				{#each snake as [x, y], i}
					{#if x && y}
						{#key time}
							<circle class="dot" fill="url(#orb{i})" cx={x} cy={y} r="{Math.max(0, _.size)}px" />

							<defs>
								<radialGradient id="orb{i}" cx="25%" cy="25%" r="100%" fx="35%" fy="25%">
									<stop
										offset="0%"
										style="stop-color:rgb({[
											10 * (((i + 1) * _.brightness) / _.orbs + 0.5),
											200 * (((i + 1) * _.brightness) / _.orbs + 0.5),
											250 * (((i + 1) * _.brightness) / _.orbs + 0.5),
										]});stop-opacity:1"
									/>
									<stop
										offset="100%"
										style="stop-color:rgb({[
											(i + 1) * _.brightness * 10,
											50 + (i + 1) * _.brightness * 10,
											100 + (i + 1) * _.brightness * 50,
										]});stop-opacity:1"
									/>
								</radialGradient>
							</defs>
						{/key}
					{/if}
				{/each}
			</g>
		</svg>
	</svg>
</div>

<style>
	.orbs {
		position: absolute;
		inset: 0;
		top: 30vh;
		margin: auto;
	}
	#die {
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}
	stop {
		transition: all 0.6s ease-in-out;
	}
	.dot,
	g {
		transition: all 0.6s ease-in-out;
	}
	svg {
		backface-visibility: hidden;
		overflow: visible;
	}
	/* input,
	p {
		height: 30px;
		display: flex;
		margin: auto;
	}
	.controls {
		display: grid;
		grid: auto-flow / 1fr 1fr;
		margin: auto;
		width: max-content;
	} */
	/* .wrapper {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		margin: auto;
	}
	.container {
		display: flex;
		flex-direction: column;
		width: 100vw;
	} */
	/* :global(body, html, main) {
		margin: 0;
		padding: 0;
	}
	:global(h1) {
		font-family: roboto;
		text-align: center;
		color: gray;
	} */
</style>
