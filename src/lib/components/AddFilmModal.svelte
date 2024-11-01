<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    let searchQuery = '';
    let searchResults: { id: string; title: string; tmdbId?: number; releaseDate?: string; posterUrl?: string }[] = [];
    let selectedFilms: { id: string; title: string; tmdbId?: number; releaseDate?: string; posterUrl?: string }[] = [];

    const dispatch = createEventDispatcher();

    async function handleSearchFilms() {
    if (!searchQuery) return;
    const response = await fetch(`/api/movies/search?q=${searchQuery}`);
    if (response.ok) {
        searchResults = await response.json();
        console.log("Résultats de recherche: ", searchResults); // Vérifiez les données ici
    } else {
        searchResults = [];
    }
}
function addFilm(film: { id: string; title: string; tmdbId?: number; releaseDate?: string; posterUrl?: string }) {
    if (!film.id || !film.title) {
        console.warn(`Film sans id ou titre:`, film);
        return;
    }

    if (!selectedFilms.some(selected => selected.id === film.id)) {
        selectedFilms = [...selectedFilms, film];
    }
}

    function removeFilm(film: { id: string; title: string; tmdbId?: number; releaseDate?: string; posterUrl?: string }) {
        selectedFilms = selectedFilms.filter(selected => selected.id !== film.id);
    }

    function confirmAddFilms() {
    selectedFilms.forEach(film => {
        if (!film.tmdbId || !film.title) {
            console.warn(`Film sans tmdbId ou titre:`, film);
        }
    });
    dispatch('addfilms', { films: selectedFilms });
    selectedFilms = [];
}
    
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" on:click={() => dispatch('close')}>
    <div class="modal-content" on:click|stopPropagation>
        <h2>Ajouter des Films</h2>
        <input type="text" bind:value={searchQuery} on:input={handleSearchFilms} placeholder="Rechercher un film" />
        
        <ul>
            {#each searchResults as film}
                <li>
                    {film.title} <button on:click={() => addFilm(film)}>Ajouter</button>
                </li>
            {/each}
        </ul>
        
        <h3>Films sélectionnés :</h3>
        <ul>
            {#each selectedFilms as film}
                <li>
                    {film.title} <button on:click={() => removeFilm(film)}>Retirer</button>
                </li>
            {/each}
        </ul>

        <button on:click={confirmAddFilms}>Confirmer l'ajout</button>
    </div>
</div>
<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
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
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        animation: fadeIn 0.3s ease;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #333;
    }

    input[type="text"] {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
        max-height: 150px;
        overflow-y: auto;
    }

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    button {
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #45a049;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>
