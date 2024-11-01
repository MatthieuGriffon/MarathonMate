import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathon, marathonParticipants, user } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';

export const GET = async ({ locals }) => {
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Sélectionne les marathons organisés par l'utilisateur ou auxquels il est invité
    const marathons = await db
        .select({
            id: marathon.id,
            name: marathon.name,
            date: marathon.date,
            status: marathon.status,
            organizerId: marathon.organizerId,
            organizerName: user.name,
            invitationCode: marathon.invitationCode,
        })
        .from(marathon)
        .leftJoin(marathonParticipants, eq(marathonParticipants.marathonId, marathon.id))
        .innerJoin(user, eq(user.id, marathon.organizerId)) // Jointure pour récupérer le nom de l'organisateur
        .where(
            or(
                eq(marathon.organizerId, locals.user.id), 
                eq(marathonParticipants.userId, locals.user.id)
            )
        );

    return json(marathons);
};

