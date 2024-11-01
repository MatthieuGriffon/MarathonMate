<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';
    export let isOpen = false;
    const dispatch = createEventDispatcher();
    let invitationCode = '';
    let errorMessage = '';
    

    async function handleJoinMarathon() {
        const response = await fetch('/marathons/validate-invitation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invitationCode })
        });

        if (response.ok) {
            const { marathonId } = await response.json();
            dispatch('joinSuccess', { marathonId });
            dispatch('close'); 
        } else {
            errorMessage = 'Code d’invitation invalide ou expiré.';
        }
    }
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if isOpen}
    <div class="modal-overlay" on:click={() => dispatch('close')}>
        <div class="modal-content" on:click|stopPropagation>
            <button class="close-button" on:click={() => dispatch('close')}>&times;</button>
            <h2>Rejoindre un Marathon</h2>
            <form on:submit|preventDefault={handleJoinMarathon}>
                {#if errorMessage}
                    <p class="error">{errorMessage}</p>
                {/if}
                <label>
                    Code d'invitation :
                    <input type="text" bind:value={invitationCode} required />
                </label>
                <button type="submit" class="button-submit">Rejoindre</button>
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
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        position: relative;
    }
    .close-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 1.5rem;
        cursor: pointer;
    }
    .error {
        color: red;
        margin-bottom: 1rem;
    }
    .button-submit {
        background-color: #232423; /* Green */
        border: none;
        color: white;
        padding: 0.8rem;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 1rem;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>