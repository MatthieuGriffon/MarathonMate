import { db } from '$lib/server/db';
import { marathon, marathonParticipants } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, locals }) => {
    const { invitationCode } = await request.json();

    // Vérifie si l'utilisateur est connecté
    const userId = locals.user?.id;
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    // Vérifie si le code d'invitation est valide
    const marathonEntry = await db
        .select()
        .from(marathon)
        .where(eq(marathon.invitationCode, invitationCode))
        .then((rows) => rows[0]);

    if (!marathonEntry) {
        return new Response(JSON.stringify({ error: 'Code d’invitation invalide' }), { status: 404 });
    }

    // Ajoute l'utilisateur au marathon
    await db.insert(marathonParticipants).values({
        marathonId: marathonEntry.id,
        userId,
        status: 'Invité'
    });

    return new Response(JSON.stringify({ marathonId: marathonEntry.id }), { status: 200 });
};