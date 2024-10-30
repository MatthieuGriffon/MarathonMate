import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathon, marathonMovies } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE = async ({ params, locals }) => {
    const { marathonId } = params;

    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérification de l'existence et de l'appartenance du marathon à l'utilisateur connecté
    const existingMarathon = await db
        .select()
        .from(marathon)
        .where(and(eq(marathon.id, marathonId), eq(marathon.organizerId, locals.user.id)))
        .then(rows => rows[0]); // On récupère le premier résultat

    if (!existingMarathon) {
        return json({ error: 'Marathon non trouvé ou accès refusé' }, { status: 404 });
    }

    try {
        // Suppression des films associés au marathon dans `marathon_movies`
        await db
            .delete(marathonMovies)
            .where(eq(marathonMovies.marathonId, marathonId));

        // Suppression du marathon
        await db.delete(marathon).where(eq(marathon.id, marathonId));

        return json({ message: 'Marathon supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du marathon:', error);
        return json({ error: 'Erreur lors de la suppression du marathon' }, { status: 500 });
    }
};
