import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/utils';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
    const user = locals.user;

    // Vérifiez que l'utilisateur est connecté
    if (!user) {
        throw error(401, 'Vous devez être connecté pour changer votre mot de passe.');
    }

    const { oldPassword, newPassword } = await request.json();

    // Récupération de l'utilisateur dans la base de données
    const dbUser = await db
        .select()
        .from(table.user)
        .where(eq(table.user.id, user.id))
        .then(([user]) => user);

    // Vérifiez que l'utilisateur existe dans la base de données
    if (!dbUser) {
        throw error(404, 'Utilisateur introuvable.');
    }

    // Si l'utilisateur s'est connecté via OAuth, il n'a pas de mot de passe
    if (!dbUser.password) {
        throw error(400, 'Les utilisateurs connectés via OAuth ne peuvent pas changer leur mot de passe.');
    }

    // Validez l'ancien mot de passe
    if (dbUser.password !== hashPassword(oldPassword)) {
        throw error(400, 'L’ancien mot de passe est incorrect.');
    }

    // Met à jour le mot de passe avec le nouveau mot de passe haché
    await db
        .update(table.user)
        .set({ password: hashPassword(newPassword) })
        .where(eq(table.user.id, user.id));

    return new Response(JSON.stringify({ message: 'Mot de passe mis à jour avec succès.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};