import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { marathonParticipants, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, params, locals }: RequestEvent) => {
    const { marathonId } = params;
    const { userId } = await request.json();

    if (!locals.user) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        // Vérifie que l'utilisateur existe
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.id, userId))
            .limit(1)
            .then(([result]) => result);

        if (!existingUser) {
            return json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Ajoute l'utilisateur comme invité au marathon
        await db.insert(marathonParticipants).values({
            marathonId: marathonId as string,
            userId: userId as string,
            status: 'Invité'
        });

        return json({ message: 'Utilisateur invité avec succès' });
    } catch {
        return json({ error: 'Erreur lors de l\'invitation de l\'utilisateur' }, { status: 500 });
    }
};



