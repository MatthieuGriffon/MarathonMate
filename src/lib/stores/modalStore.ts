import { writable } from 'svelte/store';

export const isModalInscriptionOpen = writable(false);
export const isModalConnexionOpen = writable(false);

// Fonction pour ouvrir la modal de connexion sans redirection
export function openConnexionModal() {
    isModalConnexionOpen.set(true);
}

// Fonction pour gérer la fermeture de la modal après connexion réussie
export function handleSuccessfulLogin() {
    isModalConnexionOpen.set(false);
}
