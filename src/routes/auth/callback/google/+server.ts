import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { createSession, sessionCookieName } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const GET = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect(302, '/login?error=OAuthFailed');
    }

    // Échange du code d'autorisation contre un jeton d'accès
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: 'http://localhost:5173/auth/callback/google',
            grant_type: 'authorization_code'
        })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
        throw redirect(302, '/login?error=TokenExchangeFailed');
    }

    // Récupération des informations utilisateur
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userInfo = await userInfoResponse.json();
    if (!userInfo || !userInfo.email) {
        throw redirect(302, '/login?error=UserInfoFailed');
    }

    // Gestion de l'inscription ou de la connexion
    let user = await db
        .select()
        .from(table.user)
        .where(eq(table.user.oauthProviderId, userInfo.id)) // Utilisez `eq` ici
        .then(([u]) => u);
        console.log('User:', user);

        if (!user) {
            const userId = uuidv4();
            user = await db.insert(table.user).values({
                id: userId,
                email: userInfo.email,
                name: userInfo.name,
                oauthProvider: 'google',
                oauthProviderId: userInfo.id,
                profilePicture: userInfo.picture  // Nom aligné
            }).returning().then(([u]) => u);
            console.log('New user created:', user);
        }

    // Création de la session et définition du cookie de session
    const session = await createSession(user.id);
    cookies.set(sessionCookieName, session.id, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60
    });

    throw redirect(303, '/');
};