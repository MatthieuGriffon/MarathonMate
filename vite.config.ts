import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(), // Plugin SvelteKit pour Vite

		// Plugin Paraglide pour Inlang
		paraglide({
			project: './project.inlang', // Chemin vers le projet Inlang
			outdir: './src/lib/paraglide' // Répertoire de sortie pour les fichiers générés
		})
	],
	
	// Configuration optionnelle pour les optimisations de dépendances
	optimizeDeps: {
		include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep']
	}
});
