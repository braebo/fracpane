import mdsvexConfig from './mdsvex.config.js'
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { mdsvex } from 'mdsvex'
import 'dotenv/config'

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const file = fileURLToPath(new URL('package.json', import.meta.url))
const json = readFileSync(file, 'utf8')
const pkg = JSON.parse(json)

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		preprocess({
			postcss: true,
		}),
		mdsvex(mdsvexConfig),
	],

	kit: {
		adapter: adapter(),
		prerender: {
			enabled: false, // SSR only for security
		},
		alias: {
			$package: 'src/package',
		},
	},

	package: {
		source: 'src/package', // Library directory
		dir: 'dist', // Output directory
		exports: (file) => file === 'index.ts', // Only export index.ts
		// external: Object.keys(pkg.peerDependencies), // External dependencies
	},

	vitePlugin: {
		experimental: {
			// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#inspector
			inspector: {
				toggleButtonPos: 'bottom-left',
				toggleKeyCombo: 'meta-shift',
				showToggleButton: 'active',
				holdMode: true,
			},
		},
	},
}

export default config
