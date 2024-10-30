declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				name: string | null;
				email: string;
				profile_picture: string | null;
				oauthProvider: string | null;
            } | null;
			session: {
				id: string;
				expiresAt: Date;
			} | null;
		}
	}
	type TmdbMovie = {
        id: number;
        title: string;
        release_date: string;
        overview: string;
        poster_path: string | null;
    };
}

export {};
