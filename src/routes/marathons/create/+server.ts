import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathon } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export const POST = async ({ request, locals }: RequestEvent) => {
    const { name, date } = await request.json();

    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    const marathonId = uuidv4();

    await db.insert(marathon).values({
        id: marathonId,
        organizerId: locals.user.id,
        name,
        date,
        status: 'À venir'
    });

    return json({ message: 'Marathon créé avec succès', marathonId });
};