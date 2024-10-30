import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { createSession, sessionCookieName } from '$lib/server/auth';
import { hashPassword } from '$lib/server/utils'; // Fonction pour hacher les mots de passe

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        // 1. Récupération des données du formulaire
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        // 2. Validation des entrées utilisateur
        if (!email || !password) {
            return fail(400, { error: 'Email et mot de passe sont requis.' });
        }

        // 3. Vérification de l'utilisateur dans la base de données
        const user = await db
            .select()
            .from(table.user)
            .where(eq(table.user.email, email))
            .then(([u]) => u);

        if (!user || user.password !== hashPassword(password)) {
            return fail(400, { error: 'Identifiants incorrects.', email });
        }

        // 4. Création de la session
        const session = await createSession(user.id);

        // 5. Définition du cookie de session
        cookies.set(sessionCookieName, session.id, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 
        });

        // 6. Redirection après une connexion réussie
        throw redirect(303, '/profile');
    }
};