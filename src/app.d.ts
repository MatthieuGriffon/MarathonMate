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
}

export {};
