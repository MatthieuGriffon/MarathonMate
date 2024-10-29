<script lang="ts">
    import { page } from '$app/stores';
    
    let menuOpen = false;
    function toggleMenu() {
        menuOpen = !menuOpen;
    }
    function closeMenu() {
        menuOpen = false;
    }

    import { isModalInscriptionOpen, isModalConnexionOpen } from '$lib/stores/modalStore';

    function openModalInscription() {
        isModalInscriptionOpen.set(true);
        closeMenu();
    }

    function openModalConnexion() {
        isModalConnexionOpen.set(true);
        closeMenu();
    }
    $: user = $page.data.user;
</script>

<div class="header">
    <div class="hamburger-menu">
        <input id="menu__toggle" type="checkbox" bind:checked={menuOpen} />
        <label class="menu__btn" for="menu__toggle" aria-label="Toggle menu">
            <span></span>
        </label>

        <ul class="menu__box">
            <li><a class="menu__item" href="/" on:click={() => (menuOpen = false)}>Accueil</a></li>
            <li><button class="menu__item" on:click={() => { closeMenu(); openModalConnexion(); }}>Connexion</button></li>
            <li><button class="menu__item" on:click={() => { closeMenu(); openModalInscription(); }}>Inscription</button></li>
            <li><a class="menu__item" href="/marathons" on:click={() => (menuOpen = false)}>Marathons</a></li>
            <li><a class="menu__item" href="/suggestions" on:click={() => (menuOpen = false)}>Suggestions</a></li>
            {#if user}
                <li><a class="menu__item" href="/profile" on:click={() => (menuOpen = false)}>Profil</a>
                   
                </li>
            {/if}
        </ul>
    </div>
    <div class="titre">
        <h1>Marathonmate</h1>
        {#if user}
        {user.name} <span class="status-indicator">●</span>
        {/if}
       
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-evenly; /* Espace égal entre les éléments */
        align-items: center;
        padding: 1rem;
        background-color: #f8f8f8;
        width: 100%;
    }

    .hamburger-menu {
        display: flex;
        align-items: center;
    }

    /* Masquer la checkbox */
    #menu__toggle {
        opacity: 0;
        position: absolute;
    }

    /* Animation de l'icône hamburger */
    #menu__toggle:checked + .menu__btn > span {
        transform: rotate(45deg);
    }

    #menu__toggle:checked + .menu__btn > span::before {
        top: 0;
        transform: rotate(0deg);
    }

    #menu__toggle:checked + .menu__btn > span::after {
        top: 0;
        transform: rotate(90deg);
    }

    #menu__toggle:checked ~ .menu__box {
        left: 0 !important;
    }

    .menu__btn {
        position: relative; /* Fixé au conteneur parent */
        width: 26px;
        height: 26px;
        cursor: pointer;
        z-index: 2;
    }

    .menu__btn > span,
    .menu__btn > span::before,
    .menu__btn > span::after {
        display: block;
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: #616161;
        transition-duration: 0.25s;
    }

    .menu__btn > span::before {
        content: '';
        top: -8px;
    }

    .menu__btn > span::after {
        content: '';
        top: 8px;
    }

    /* Styles du menu déroulant */
    .menu__box {
        display: block;
        position: fixed;
        top: 0;
        left: -100%;
        width: 300px;
        height: 100rem;
        margin: 0;
        padding: 80px 0;
        list-style: none;
        background-color: #ECEFF1;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
        transition-duration: 0.25s;
        z-index: 1;
    }

    .menu__item {
        display: block;
        padding: 12px 24px;
        color: #333;
        font-size: 20px;
        font-weight: 600;
        text-decoration: none;
        transition-duration: 0.25s;
    }

    .menu__item:hover {
        background-color: #CFD8DC;
    }

    .titre {
        text-align: center;
        flex: 1; /* Occupe l'espace restant */
    }
    .status-indicator {
        color: green; /* Indicateur vert pour signaler que l'utilisateur est connecté */
        font-size: 1.2em;
        margin-left: 5px;
    }
</style>
