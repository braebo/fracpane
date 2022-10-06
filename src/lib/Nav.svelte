<script lang="ts">
	import { ThemeToggle, theme } from 'fractils'

	if (typeof localStorage !== 'undefined' && !('theme' in localStorage)) {
		const prefersDark = typeof window !== 'undefined' ? window?.matchMedia('(prefers-color-scheme: dark)').matches : false
		$theme = prefersDark ? 'dark' : 'light'
	}
</script>

<nav>
	<div class="left">
		<a href="/">Demo</a>
		<a href="/docs">Docs</a>
	</div>
	<div class="right">
		<ThemeToggle />
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100vw;
		gap: 1rem;
	}

	a {
		font-size: 1.2rem;
		color: var(--dark-a);
		text-decoration: none;
		margin-right: 1rem;
	}
</style>
