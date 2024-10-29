// src/routes/register/+server.ts
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { createSession } from '$lib/server/auth';
import { hashPassword } from '$lib/server/utils';
import { json, redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';


export const POST = async ({ request, cookies }) => {
    // Récupération et validation des données
    const formData = await request.formData();
    const username = formData.get('username')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString().trim();

    if (!username || !email || !password) {
        return json({ error: 'Tous les champs sont requis.' }, { status: 400 });
    }

    // Vérification de l'utilisateur existant
    const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email)) // Utilisez eq ici pour vérifier l'égalité
    .then(([user]) => user);

if (existingUser) {
    return json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
}

    
    // Créer un nouvel utilisateur avec mot de passe haché
    const newUser = {
        id: uuidv4(),
        name: username,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
    };

    await db.insert(userTable).values(newUser);

    // Créer la session et définir le cookie
    const session = await createSession(newUser.id);
    cookies.set('auth-session', session.id, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
    });

    // Redirection vers le profil après succès
    throw redirect(303, '/profile');
};
