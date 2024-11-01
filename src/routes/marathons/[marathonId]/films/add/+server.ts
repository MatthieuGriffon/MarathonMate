import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonMovies, movie as movieTable } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ params, request }: RequestEvent) => {
    const { marathonId } = params;
    const { films } = await request.json();

    if (!marathonId) {
        return json({ error: 'Marathon ID manquant' }, { status: 400 });
    }

    if (!films || films.length === 0) {
        return json({ error: 'Aucun film sélectionné' }, { status: 400 });
    }

    try {
        for (const film of films) {
            const { id, title, tmdbId, releaseDate, posterUrl } = film;

            // Validation des données du film
            if (!tmdbId || !title) {
                console.warn(`Film sans tmdbId ou titre: ${title || 'Inconnu'}`);
                continue;
            }

            // Vérifie si le film existe déjà
            let movieId = id;
            const existingMovie = await db
                .select()
                .from(movieTable)
                .where(eq(movieTable.tmdbId, tmdbId))
                .execute();

            if (existingMovie.length === 0) {
                movieId = uuidv4();
                await db.insert(movieTable).values({
                    id: movieId,
                    tmdbId,
                    title,
                    releaseDate: releaseDate ? new Date(releaseDate) : null,
                    posterUrl
                });
            } else {
                movieId = existingMovie[0].id;
            }

            // Ajouter l'association entre le marathon et le film
            await db.insert(marathonMovies).values({
                marathonId,
                movieId
            });
        }

        return json({ message: 'Films ajoutés avec succès' });
    } catch (error) {
        console.error('Erreur lors de l’ajout des films:', error);
        return json({ error: 'Erreur serveur lors de l’ajout des films' }, { status: 500 });
    }
};
