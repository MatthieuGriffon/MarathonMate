<script lang="ts">
    export let isOpen: boolean;
    export let onClose: () => void;
    import { invalidateAll } from '$app/navigation';
    
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = '';

    async function handleSubmit(event: Event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            errorMessage = 'Les mots de passe ne correspondent pas.';
            return;
        }

        errorMessage = '';
        
        try {
            const response = await fetch('/register', {
                method: 'POST',
                body: new URLSearchParams({ username, email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                errorMessage = data.error || 'Échec de l\'inscription.';
            } else {
                await invalidateAll();
                onClose();
            }
        } catch (err) {
            errorMessage = 'Erreur lors de l\'inscription.';
        }
    }
</script>

{#if isOpen}
 <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
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
            <h2>Inscription</h2>
            <form on:submit={handleSubmit}>
                {#if errorMessage}
                    <p class="error-message">{errorMessage}</p>
                {/if}
                <label>
                    Nom d'utilisateur :
                    <input type="text" bind:value={username} required />
                </label>
                <label>
                    Email :
                    <input type="email" bind:value={email} required />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" bind:value={password} required />
                </label>
                <label>
                    Confirmer le mot de passe :
                    <input type="password" bind:value={confirmPassword} required />
                </label>
                <button type="submit">S'inscrire</button>
            </form>
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
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: grayscale(100%) contrast(1.2);
    }

    /* Contenu de la modal */
    .modal-content {
        background: #f0f0f0;
        padding: 2rem;
        border-radius: 8px;
        position: relative;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        font-family: 'Courier New', Courier, monospace;
        color: #333;
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
        color: #333;
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

    input[type="text"],
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
        background-color: #555;
    }

    .error-message {
        color: red;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        text-align: center;
    }
</style>
