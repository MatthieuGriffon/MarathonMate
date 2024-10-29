import { redirect } from '@sveltejs/kit';
import { sessionCookieName, invalidateSession } from '$lib/server/auth'; // Modifiez en fonction de l'import réel

export const POST = async ({ cookies, locals }) => {
    const sessionId = cookies.get(sessionCookieName);

    if (sessionId) {
        // Invalider la session dans la base de données
        await invalidateSession(sessionId);

        // Supprimer le cookie de session
        cookies.delete(sessionCookieName, { path: '/' });
    }

    // Réinitialiser `locals.user`
    locals.user = null;

    // Rediriger vers la page d'accueil après déconnexion
    throw redirect(303, '/');
};