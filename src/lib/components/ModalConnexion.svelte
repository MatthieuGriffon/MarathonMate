<script lang="ts">
    export let isOpen: boolean;
    export let onClose: () => void;
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
            <h2>Connexion</h2>
            <form>
                <label>
                    Email :
                    <input type="email" required />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" required />
                </label>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        position: relative;
        max-width: 500px;
        width: 90%;
    }

    .close-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
</style>

