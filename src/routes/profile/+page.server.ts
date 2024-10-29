import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    console.log('locals.user:', locals.user); 
    if (!locals.user) {
        // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        throw redirect(302, '/login');
    }

    // Retourne les informations de l'utilisateur pour l'afficher dans le profil
    return {
        user: locals.user
    };
};