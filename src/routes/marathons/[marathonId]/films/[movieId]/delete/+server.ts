import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonMovies, marathon } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE = async ({ params, locals }: RequestEvent) => {
    const { marathonId, movieId } = params;

    // Vérification de l'authentification
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifie que l'utilisateur est l'organisateur du marathon
    const isOrganizer = await db
        .select({ organizerId: marathon.organizerId })
        .from(marathon)
        .where(eq(marathon.id, marathonId as string))
        .limit(1)
        .then(([result]) => result?.organizerId === locals.user?.id);

    if (!isOrganizer) {
        return json({ error: "Seul l'organisateur peut supprimer un film du marathon" }, { status: 403 });
    }

    // Suppression du film du marathon dans la table marathonMovies
    await db
        .delete(marathonMovies)
        .where(and(eq(marathonMovies.marathonId, marathonId as string), eq(marathonMovies.movieId, movieId as string)));

    return json({ message: 'Film supprimé avec succès du marathon' });
};
