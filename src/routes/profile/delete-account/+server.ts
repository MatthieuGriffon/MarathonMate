import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, list, listMovies, marathon, ratings, auditLog, session, marathonParticipants } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async (event: RequestEvent) => {
    const userId = event.locals.user?.id;

    if (!userId) {
        throw error(401, 'Utilisateur non authentifié.');
    }

    try {
        // Suppression des dépendances en cascade
        await db.delete(auditLog).where(eq(auditLog.userId, userId));
        await db.delete(session).where(eq(session.userId, userId));
        await db.delete(ratings).where(eq(ratings.userId, userId));
        await db.delete(marathonParticipants).where(eq(marathonParticipants.userId, userId));

        // Suppression des marathons organisés par l'utilisateur
        await db.delete(marathon).where(eq(marathon.organizerId, userId));

        // Récupérer les listes de l'utilisateur
        const userLists = await db
            .select({ id: list.id })
            .from(list)
            .where(eq(list.userId, userId));

        // Supprimer les films associés dans listMovies pour chaque liste
        for (const { id: listId } of userLists) {
            await db.delete(listMovies).where(eq(listMovies.listId, listId));
        }

        // Supprimer les listes de l'utilisateur
        await db.delete(list).where(eq(list.userId, userId));

        // Supprimer l'utilisateur
        await db.delete(user).where(eq(user.id, userId));

        // Invalidation de la session
        event.locals.user = null;

        // Retourne un code de succès sans redirection
        return new Response(null, { status: 204 });
    } catch (err) {
        console.error('Erreur lors de la suppression du compte :', err);
        throw error(500, 'Erreur lors de la suppression du compte.');
    }
};

