import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonMovies, movie } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params, locals }: RequestEvent) => {
    const { marathonId } = params;
    if (!marathonId) {
        return json({ error: 'Marathon ID is required' }, { status: 400 });
    }

    // Vérification de l'authentification de l'utilisateur
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        // Récupérer les films associés au marathon
        const films = await db
            .select({
                id: movie.id,
                title: movie.title,
                releaseDate: movie.releaseDate,
                posterUrl: movie.posterUrl
            })
            .from(marathonMovies)
            .innerJoin(movie, eq(marathonMovies.movieId, movie.id))
            .where(eq(marathonMovies.marathonId, marathonId));

        return json(films, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Erreur lors de la récupération des films du marathon' }, { status: 500 });
    }
};