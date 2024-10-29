import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get(auth.sessionCookieName);

    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user: authUser } = await auth.validateSession(sessionId);

    if (session) {
        event.cookies.set(auth.sessionCookieName, session.id, {
            path: '/',
            sameSite: 'lax',
            httpOnly: true,
            expires: session.expiresAt,
            secure: !dev
        });
    } else {
        event.cookies.delete(auth.sessionCookieName, { path: '/' });
    }

    // Si un utilisateur est authentifié, recharge ses informations depuis la base de données
    if (authUser) {
        const userRecord = await db.select().from(user).where(eq(user.id, authUser.id)).execute();
        
        // Met à jour event.locals.user avec les données actualisées
        event.locals.user = userRecord && userRecord[0] ? {
            id: userRecord[0].id,
            name: userRecord[0].name,
            email: userRecord[0].email,
            profile_picture: userRecord[0].profilePicture,
            oauthProvider: userRecord[0].oauthProvider
        } : null;
    } else {
        event.locals.user = null;
    }

    event.locals.session = session;
    return resolve(event);
};

// Utilise sequence pour enchaîner handleParaglide et handleAuth
export const handle: Handle = sequence(handleParaglide, handleAuth);
