declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
}
declare namespace App {
    interface Locals {
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        session: {
            id: string;
            expiresAt: Date;
        } | null;
    }
}

export {};
