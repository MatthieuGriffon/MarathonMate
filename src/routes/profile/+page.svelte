
<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';

    // Obtenez les informations de `user` depuis `$page.data`
    $: user = $page.data.user;
    console.log('Données utilisateur dans le composant profil:', user);

    async function handleLogout() {
        
        await fetch('/logout', { method: 'POST' });
        await invalidateAll();
        goto('/'); 
    }
</script>

{#if user}
    <section class="profile">
        <h1>Profil de {user.name}</h1>
        <div class="profile-info">
            <p><strong>Nom :</strong> {user.name}</p>
            <p><strong>Email :</strong> {user.email}</p>
        </div>
        <button on:click={handleLogout}>Se déconnecter</button>
    </section>
{:else}
    <p>Veuillez vous connecter pour accéder à votre profil.</p>
{/if}

<style>
    .profile {
        max-width: 600px;
        margin: auto;
        padding: 2rem;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    .profile-info p {
        margin: 0.5rem 0;
        font-size: 1.1rem;
    }

    button {
        margin-top: 1.5rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #555;
    }
</style>
