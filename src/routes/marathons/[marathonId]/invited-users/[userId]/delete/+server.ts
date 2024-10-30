import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonParticipants, marathon } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE = async ({ params, locals }: RequestEvent) => {
    const { marathonId, userId } = params;

    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        // Vérifie que l'utilisateur connecté est l'organisateur du marathon
        const isOrganizer = await db
            .select({ organizerId: marathon.organizerId })
            .from(marathon)
            .where(eq(marathon.id, marathonId as string))
            .limit(1)
            .then(([result]) => result?.organizerId === locals.user?.id);

        if (!isOrganizer) {
            return json({ error: "Seul l'organisateur peut retirer un invité" }, { status: 403 });
        }

        // Supprime l'utilisateur invité du marathon
        await db
            .delete(marathonParticipants)
            .where(
                and(
                    eq(marathonParticipants.marathonId, marathonId as string),
                    eq(marathonParticipants.userId, userId as string)
                )
            );

            return json({ message: 'Utilisateur retiré avec succès' });
        } catch {  // Remplacement de 'error' par '_'
            return json({ error: 'Erreur lors de la suppression de l\'invité' }, { status: 500 });
        }
    };