<script lang="ts">
    import { enhance } from '$app/forms';
    export let isOpen: boolean;
    export let onClose: () => void;
    let formResult: any = null;
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        on:click={onClose}
        on:keydown={(event) => event.key === 'Escape' && onClose()}
    >
        <div class="modal-content" on:click|stopPropagation>
            <button
                class="close-button"
                on:click={onClose}
                aria-label="Fermer la modal"
                type="button"
            >
                &times;
            </button>
            <h2>Connexion</h2>
            <form method="POST" action="?/login" use:enhance on:submit={() => formResult = null}>
                {#if formResult?.error}
                    <p class="error">{formResult.error}</p>
                {/if}
                <label>
                    Email :
                    <input type="email" name="email" required />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" name="password" required />
                </label>
                <button type="submit">Se connecter</button>
            </form>

            <!-- Options de connexion OAuth -->
            <div class="oauth-options">
                <p>Ou connectez-vous avec :</p>
                <button type="button" on:click={() => window.location.href = '/auth/login/google'}>Google</button>
                <button type="button" on:click={() => window.location.href = '/auth/login/github'}>GitHub</button>
            </div>
        </div>
    </div>
{/if}


<style>
    /* Arrière-plan de la modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Renforce le contraste */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: grayscale(100%) contrast(1.2); /* Effet noir et blanc */
    }

    /* Contenu de la modal */
    .modal-content {
        background: #f0f0f0; /* Légèrement gris pour rappeler les anciens écrans */
        padding: 2rem;
        border-radius: 8px;
        position: relative;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Ombre pour effet de profondeur */
        font-family: 'Courier New', Courier, monospace; /* Police de style machine à écrire */
        color: #333; /* Couleur sombre pour le texte */
    }

    /* Bouton de fermeture */
    .close-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #333; /* Harmonise avec le reste */
        font-weight: bold;
    }

    /* Forme et champs du formulaire */
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        font-weight: bold;
    }

    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 0.5rem;
        border: 2px solid #999;
        border-radius: 4px;
        background-color: #e0e0e0;
        color: #333;
    }

    button[type="submit"] {
        background-color: #333;
        color: #fff;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button[type="submit"]:hover {
        background-color: #555; /* Effet visuel rétro lors du survol */
    }
    /* Styles pour les options OAuth */
    .oauth-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
        margin-top: 1rem;
    }

    .oauth-options button {
        background-color: #4285f4; /* Couleur Google par exemple */
        color: #fff;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .oauth-options button:hover {
        background-color: #357ae8;
    }

    .oauth-options button:nth-child(2) {
        background-color: #333; /* Couleur GitHub */
    }

    .oauth-options button:nth-child(2):hover {
        background-color: #555;
    }
</style>


