<script lang="ts">
    import { onMount } from 'svelte';
    
    let marathons: Marathon[] = [];
    let showModal = false;
    let showInviteModal = false;
    let marathonToDelete: string | null = null;
    let userToDelete: { marathonId: string; userId: string } | null = null;

    onMount(async () => {
        const response = await fetch('/marathons', { method: 'GET' });
        if (response.ok) {
            marathons = await response.json();
        } else {
            console.error('Erreur lors du chargement des marathons');
        }
    });

    async function addMoviesToMarathon(marathonId: string, movies: { id: string; title: string; releaseDate: string; posterUrl: string }[]) {
        const response = await fetch(`/marathons/${marathonId}/films/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ films: movies })
        });
        if (!response.ok) {
            console.error("Erreur lors de l'ajout des films au marathon");
        }
    }
    async function toggleMarathon(marathonId: string) {
    marathons = await Promise.all(
        marathons.map(async (marathon) => {
            if (marathon.id === marathonId) {
                const isOpen = !marathon.isOpen;
                
                // Initialisation de `films` et `invitedUsers` en tant que tableaux vides si elles ne sont pas définies
                const films = isOpen && (!marathon.films || marathon.films.length === 0)
                    ? await loadMarathonMovies(marathonId)
                    : marathon.films || [];
                    
                const invitedUsers = isOpen && (!marathon.invitedUsers || marathon.invitedUsers.length === 0)
                    ? await loadInvitedUsers(marathonId)
                    : marathon.invitedUsers || [];

                return {
                    ...marathon,
                    isOpen,
                    films,
                    invitedUsers,
                };
            }
            return marathon;
        })
    );
}
    async function loadMarathonMovies(marathonId: string) {
        const response = await fetch(`/marathons/${marathonId}/films`, { method: 'GET' });
        if (response.ok) {
            const movies = await response.json();
            return movies;
        } else {
            console.error("Erreur lors du chargement des films");
            return [];
        }
    }
    async function loadInvitedUsers(marathonId: string) {
        const response = await fetch(`/marathons/${marathonId}/invited-users`, { method: 'GET' });
        if (response.ok) {
            const invitedUsers = await response.json();
            return invitedUsers;
        } else {
            console.error("Erreur lors du chargement des utilisateurs invités");
            return [];
        }
    }
    function copyInvitationLink(marathonId: string) {
        const invitationLink = `${window.location.origin}/marathons/join/${marathonId}`;
        navigator.clipboard.writeText(invitationLink)
            .then(() => {
                showInviteModal = true;
            })
            .catch((error) => console.error('Erreur lors de la copie du lien :', error));
    }
    function openDeleteModal(marathonId: string) {
        marathonToDelete = marathonId;
        showModal = true;
    }
    async function confirmDeleteMarathon() {
        if (marathonToDelete) {
            const response = await fetch(`/marathons/${marathonToDelete}/delete`, { method: 'DELETE' });
            if (response.ok) {
                marathons = marathons.filter(marathon => marathon.id !== marathonToDelete);
                marathonToDelete = null;
                showModal = false;
            } else {
                console.error("Erreur lors de la suppression du marathon");
            }
        }
    }
    function cancelDelete() {
        marathonToDelete = null;
        showModal = false;
    }
    function closeInviteModal() {
        showInviteModal = false;
    }
    function openUserDeleteModal(marathonId: string, userId: string) {
        userToDelete = { marathonId, userId };
        showModal = true;
    }
    async function confirmDeleteUser() {
        if (userToDelete) {
            const { marathonId, userId } = userToDelete;
            const response = await fetch(`/marathons/${marathonId}/invited-users/${userId}/delete`, { method: 'DELETE' });
            if (response.ok) {
                marathons = marathons.map(marathon => {
                    if (marathon.id === marathonId) {
                        return {
                            ...marathon,
                            invitedUsers: marathon.invitedUsers.filter(user => user.id !== userId)
                        };
                    }
                    return marathon;
                });
                userToDelete = null;
                showModal = false;
            } else {
                console.error("Erreur lors de la suppression de l'invité");
            }
        }
    }
</script>

<div class="marathons-list">
    <h1>Liste de vos Marathons</h1>
    {#if marathons.length === 0}
        <p>Vous n'avez pas encore de marathons.</p>
    {/if}

    {#each marathons as marathon}
        <div class="marathon-card">
            <div class="marathon-header">
                <h3>{marathon.name}</h3>
                <button on:click={() => toggleMarathon(marathon.id)}>
                    {marathon.isOpen ? 'Masquer les films' : 'Voir les films'}
                </button>
            </div>
            {#if marathon.isOpen}
                <div class="films-list">
                    <h4>Films :</h4>
                    <ul>
                        {#each marathon.films as film}
                            <li>
                                <img src={film.posterUrl} alt="Affiche de {film.title}" class="film-poster" />
                                <div class="film-info">
                                    <p><strong>{film.title}</strong></p>
                                    <p>Date de sortie : {film.releaseDate}</p>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
                <div class="invited-users">
                    <h4>Utilisateurs invités :</h4>
                    <ul>
                        {#each marathon.invitedUsers as user}
                            <li>
                                {user.name} - {user.status}
                                <button on:click={() => openUserDeleteModal(marathon.id, user.id)} class="remove-user-button">
                                    Supprimer
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
            <div class="button-group">
                <button on:click={() => copyInvitationLink(marathon.id)}>
                    Copier le lien d'invitation
                </button>
                <button class="delete" on:click={() => openDeleteModal(marathon.id)}>
                    Supprimer
                </button>
            </div>
        </div>
    {/each}
</div>

{#if showModal}
    <div class="modal-overlay">
        <div class="modal">
            <h2>Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer ce marathon ? Cette action est irréversible.</p>
            <div class="modal-buttons">
                <button class="confirm" on:click={confirmDeleteMarathon}>Oui, supprimer</button>
                <button class="cancel" on:click={cancelDelete}>Annuler</button>
            </div>
        </div>
    </div>
{/if}

{#if showInviteModal}
    <div class="modal-overlay">
        <div class="modal">
            <h2>Lien copié !</h2>
            <p>Le lien d'invitation a été copié dans votre presse-papiers.</p>
            <button on:click={closeInviteModal} class="close">OK</button>
        </div>
    </div>
{/if}
{#if showModal && userToDelete}
    <div class="modal-overlay">
        <div class="modal">
            <h2>Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur invité ?</p>
            <div class="modal-buttons">
                <button class="confirm" on:click={confirmDeleteUser}>Oui, supprimer</button>
                <button class="cancel" on:click={cancelDelete}>Annuler</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .marathons-list {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1rem;
    }

    .marathon-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: #f9f9f9;
    }

    .marathon-card h3 {
        margin: 0;
        font-size: 1.25rem;
    }

    .marathon-card p {
        margin: 0.5rem 0;
    }

    .films-list {
        margin-top: 1rem;
    }

    .films-list h4 {
        margin-bottom: 0.5rem;
    }

    .films-list ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .films-list li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .film-poster {
        width: 50px;
        height: 75px;
        object-fit: cover;
        border-radius: 4px;
    }

    .film-info {
        display: flex;
        flex-direction: column;
    }

    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button.delete {
        background-color: #e74c3c;
        color: white;
    }

    button:not(.delete) {
        background-color: #737973;
        color: white;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    }
    .remove-user-button {
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        cursor: pointer;
        margin: 0.5rem;
    }
    .remove-user-button:hover {
        background-color: #e74c3c;
    }
</style>
