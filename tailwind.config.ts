import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: { logs: false }
} satisfies Config;
