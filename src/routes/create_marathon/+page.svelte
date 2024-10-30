<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    let marathonName = '';
    let marathonDate = '';
    let searchQuery = '';
    let searchResults: { title: string }[] = [];
    let selectedFilms: { title: string }[] = [];
    let confirmationMessage = ''; // Nouveau message de confirmation

    async function handleCreateMarathon(event: Event) {
        event.preventDefault();

        if (!marathonName || !marathonDate || selectedFilms.length === 0) {
            alert('Veuillez renseigner le nom, la date du marathon et sélectionner des films.');
            return;
        }

        const response = await fetch('/marathons/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: marathonName, date: marathonDate, films: selectedFilms })
        });

        if (response.ok) {
            confirmationMessage = 'Marathon créé avec succès !'; // Affiche le message
            setTimeout(async () => {
                await invalidateAll(); // Rafraîchit les données de la page
                confirmationMessage = ''; // Réinitialise le message
            }, 3000); // Délais de 3 secondes
        }

        marathonName = '';
        marathonDate = '';
        selectedFilms = [];
    }

    async function handleSearchFilms() {
        if (!searchQuery) return;

        const response = await fetch(`/api/movies/search?q=${searchQuery}`);
        if (response.ok) {
            searchResults = await response.json();
        } else {
            searchResults = [];
        }
    }

    function addFilmToMarathon(film: { title: string }) {
        if (!selectedFilms.some(selected => selected.title === film.title)) {
            selectedFilms = [...selectedFilms, film];
        }
    }

    function removeFilmFromMarathon(film: { title: string }) {
        selectedFilms = selectedFilms.filter(selected => selected.title !== film.title);
    }
</script>

<div class="marathon-form">
    <label for="name">Nom du Marathon :</label>
    <input type="text" id="name" bind:value={marathonName} required />

    <label for="date">Date :</label>
    <input type="date" id="date" bind:value={marathonDate} required />
</div>

<div class="search-results">
    <label for="search">Rechercher des films :</label>
    <input type="text" id="search" bind:value={searchQuery} on:input={handleSearchFilms} />

    <ul>
        {#each searchResults as result}
            <li>
                {result.title} <button class="add" on:click={() => addFilmToMarathon(result)}>Ajouter</button>
            </li>
        {/each}
    </ul>
</div>

<div class="selected-films">
    <h3>Films sélectionnés pour le marathon :</h3>
    <ul>
        {#each selectedFilms as film}
            <li>
                {film.title} <button class="remove" on:click={() => removeFilmFromMarathon(film)}>Retirer</button>
            </li>
        {/each}
    </ul>
</div>

{#if confirmationMessage}
    <p class="confirmation-message">{confirmationMessage}</p>
{/if}

<button class="create-marathon-button" on:click={handleCreateMarathon}>Créer Marathon</button>

<style>
    .confirmation-message {
        color: green;
        text-align: center;
        margin-top: 1rem;
        font-weight: bold;
    }

    .marathon-form, .search-results, .selected-films {
        margin: 1.5rem 1.5rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .search-results ul, .selected-films ul {
        max-height: 200px;
        overflow-y: auto;
        list-style-type: none;
        padding: 0;
    }

    .search-results li, .selected-films li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    button.add, button.remove {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        cursor: pointer;
        border: none;
        border-radius: 4px;
    }

    button.add {
        background-color: #4caf50;
        color: white;
    }

    button.remove {
        background-color: #e74c3c;
        color: white;
    }

    .create-marathon-button {
        display: block;
        width: 100%;
        max-width: 300px;
        margin: 2rem auto;
        padding: 0.8rem;
        font-size: 1rem;
        background-color: #7f8183;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .create-marathon-button:hover {
        background-color: #313131;
    }
</style>
