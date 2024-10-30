// routes/marathons/[marathonId]/films/add/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathon, marathonMovies, movie } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ params, request, locals }: RequestEvent) => {
    const { marathonId } = params;
    const { films } = await request.json();

    if (!marathonId) {
        return json({ error: 'Marathon ID manquant' }, { status: 400 });
    }

    // Vérifier que l'utilisateur est authentifié
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier si le marathon appartient bien à l'utilisateur connecté
    const existingMarathon = await db
        .select()
        .from(marathon)
        .where(eq(marathon.id, marathonId))
        .limit(1)
        .then(([result]) => result);

    if (!existingMarathon || existingMarathon.organizerId !== locals.user.id) {
        return json({ error: 'Marathon introuvable ou accès non autorisé' }, { status: 403 });
    }

    // Ajouter les films au marathon
    try {
        await db.transaction(async (trx) => {
            for (const film of films) {
                // Vérifier si le film existe déjà dans la base de données
                const existingMovie = await trx
                    .select()
                    .from(movie)
                    .where(eq(movie.id, film.id))
                    .limit(1)
                    .then(([result]) => result);

                // Si le film n'existe pas, l'ajouter
                if (!existingMovie) {
                    await trx.insert(movie).values({
                        id: film.id,
                        tmdbId: film.tmdbId,
                        title: film.title,
                        releaseDate: film.releaseDate,
                        posterUrl: film.posterUrl,
                    });
                }

                // Ajouter l'association entre le marathon et le film dans marathonMovies
                await trx.insert(marathonMovies).values({
                    marathonId: marathonId as string, // s'assurer que marathonId est bien une chaîne
                    movieId: film.id,
                });
            }
        });

        return json({ message: 'Films ajoutés avec succès' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Erreur lors de l’ajout des films au marathon' }, { status: 500 });
    }
};
