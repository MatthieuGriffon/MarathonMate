import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonParticipants, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params, locals }: RequestEvent) => {
    const { marathonId } = params;

    // Vérification de l'authentification de l'utilisateur
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        // Récupérer les utilisateurs invités au marathon
        const invitedUsers = await db
            .select({
                id: user.id,
                name: user.name,
                status: marathonParticipants.status
            })
            .from(marathonParticipants)
            .innerJoin(user, eq(marathonParticipants.userId, user.id))
            .where(eq(marathonParticipants.marathonId, marathonId as string));

        return json(invitedUsers, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Erreur lors de la récupération des utilisateurs invités' }, { status: 500 });
    }
};
