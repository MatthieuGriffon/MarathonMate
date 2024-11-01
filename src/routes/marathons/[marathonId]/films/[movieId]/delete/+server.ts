import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonMovies } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE = async ({ params, locals }: RequestEvent) => {
    const { marathonId, movieId } = params;

    // Vérification de l'authentification
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

if (!locals.user) {
    return json({ error: 'Non authentifié' }, { status: 401 });
}
    

    // Suppression du film du marathon dans la table marathonMovies
    await db
        .delete(marathonMovies)
        .where(and(eq(marathonMovies.marathonId, marathonId as string), eq(marathonMovies.movieId, movieId as string)));

    return json({ message: 'Film supprimé avec succès du marathon' });
};
