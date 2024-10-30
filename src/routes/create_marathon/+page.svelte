<script lang="ts">
    import { page } from '$app/stores';
    let marathonName = '';
    let marathonDate = '';
    let searchQuery = '';
    let searchResults: { title: string }[] = [];
    let selectedFilms: { title: string }[] = [];

    // Fonction pour créer un marathon
    async function handleCreateMarathon(event: Event) {
        event.preventDefault();

        if (!marathonName || !marathonDate || selectedFilms.length === 0) {
            alert('Veuillez renseigner le nom, la date du marathon et sélectionner des films.');
            return;
        }

        // Appel backend pour créer le marathon
        await fetch('/marathons/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: marathonName, date: marathonDate, films: selectedFilms })
        });

        // Réinitialisation du formulaire
        marathonName = '';
        marathonDate = '';
        selectedFilms = [];
    }

    // Fonction pour rechercher des films
    async function handleSearchFilms() {
        if (!searchQuery) return;

        const response = await fetch(`/api/movies/search?q=${searchQuery}`);
        if (response.ok) {
            searchResults = await response.json();
        } else {
            searchResults = [];
        }
    }

    // Fonction pour ajouter un film sans doublons
    function addFilmToMarathon(film: { title: string }) {
        if (!selectedFilms.some(selected => selected.title === film.title)) {
            selectedFilms = [...selectedFilms, film];
        }
    }

    // Fonction pour retirer un film de la sélection
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

<button class="create-marathon-button" on:click={handleCreateMarathon}>Créer Marathon</button>

<style>
.marathon-form, .search-results, .selected-films {
    margin: 1.5rem 1.5rem; /* Espacement autour des cartes */
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

/* Limite la hauteur de la carte de résultats de recherche et active le défilement */
.search-results ul, .selected-films ul {
    max-height: 200px;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
}

/* Styles pour les éléments dans les listes */
.search-results li, .selected-films li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

/* Boutons d'ajout et de retrait */
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

button.add:hover, button.remove:hover {
    opacity: 0.9;
}

/* Bouton Créer Marathon */
.create-marathon-button {
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 2rem auto; /* Centre le bouton et ajoute de l’espace en haut */
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