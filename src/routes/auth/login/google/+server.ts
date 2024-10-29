import { redirect } from '@sveltejs/kit';

export const GET = async () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:5173/auth/callback/google')}&scope=profile%20email`;

    throw redirect(302, googleAuthUrl);
};