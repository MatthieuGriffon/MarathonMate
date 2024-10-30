import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathon, movie as movieTable, marathonMovies } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, locals }: RequestEvent) => {
    const { name, date, films } = await request.json();

    // Vérification de l'authentification
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Validation des champs requis
    if (!name || !date || !films || films.length === 0) {
        return json({ error: 'Nom, date et au moins un film sont requis' }, { status: 400 });
    }

    try {
        // Conversion de `date` en objet `Date`
        const marathonDate = new Date(date);

        if (isNaN(marathonDate.getTime())) {
            return json({ error: 'Format de date invalide' }, { status: 400 });
        }

        // Création du marathon
        const marathonId = uuidv4();
        await db.insert(marathon).values({
            id: marathonId,
            organizerId: locals.user.id,
            name,
            date: marathonDate,
            status: 'À venir',
            createdAt: new Date()
        });

        // Ajout des films au marathon
        for (const film of films) {
            const existingMovie = await db
                .select()
                .from(movieTable)
                .where(eq(movieTable.tmdbId, film.id))
                .execute();

            let movieId;
            if (existingMovie.length > 0) {
                movieId = existingMovie[0].id;
            } else {
                // Assurez-vous que les noms de propriétés sont corrects
                movieId = uuidv4();
                await db.insert(movieTable).values({
                    id: movieId,
                    tmdbId: film.id,
                    title: film.title,
                    releaseDate: film.releaseDate ? new Date(film.releaseDate) : null,
                    posterUrl: film.posterPath
                });
            }

            // Insère le lien entre le marathon et le film
            await db.insert(marathonMovies).values({
                marathonId,
                movieId
            });
        }

        return json({ message: 'Marathon créé avec succès', marathonId });
    } catch (error) {
        console.error('Erreur lors de la création du marathon:', error);
        return json({ error: 'Erreur serveur lors de la création du marathon' }, { status: 500 });
    }
};
