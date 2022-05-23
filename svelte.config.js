import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$routes:			path.resolve('src/routes'),
					$stores:			path.resolve('src/stores'),
					$components:		path.resolve('src/components'),
					$types:				path.resolve('src/types.ts'),
					"$routes/*":		path.resolve('src/routes/*'),
					"$stores/*":		path.resolve('src/stores/*'),
					"$components/*":	path.resolve('src/components/*'),
					"$types/*":			path.resolve('src/types/*'),
				}
			}
		}
	}
};

export default config;
