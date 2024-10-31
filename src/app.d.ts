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
	type InvitedUser = {
        id: string;
        name: string;
        status: string;
    };
    type Film = {
        id: string;
        title: string;
        releaseDate: string;
        posterUrl: string;
    };
    type Marathon = {
        id: string;
        name: string;
        date: string;
        status: string;
        films: Film[];
        isOpen: boolean;
        invitedUsers: InvitedUser[];
        invitationCode: string; // Add this line // Type explicite pour les utilisateurs invités
    };
}

export {};
