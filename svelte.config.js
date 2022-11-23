import adapter from '@sveltejs/adapter-netlify';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default {
	preprocess: [
		sveltePreprocess({
			scss: {
				prependData: `@import './src/variables.scss';`
			},
			postcss: {
				plugins: [autoprefixer()]
			}
		})
	],
	extensions: ['.svelte'],
	kit: {
		adapter: adapter(),
		files: {
			lib: path.resolve('./src/lib')
		}
	},
};
