import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3333,
		fs: {
			allow: ['./dist'],
		},
	},
})

export default config
