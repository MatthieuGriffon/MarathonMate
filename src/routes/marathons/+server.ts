import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathon } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET = async ({ locals }) => {
    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    const marathons = await db
        .select({
            id: marathon.id,
            name: marathon.name,
            date: marathon.date,
            status: marathon.status,
            organizerId: marathon.organizerId,
            invitationCode: marathon.invitationCode,
        })
        .from(marathon)
        .where(eq(marathon.organizerId, locals.user.id)); 

    return json(marathons);
};
