<script lang="ts">
    import CarouselComponent from '$lib/components/MovieSlider.svelte';
    import ModalInscription from '$lib/components/ModalInscription.svelte';
    import ModalConnexion from '$lib/components/ModalConnexion.svelte';
    import { isModalInscriptionOpen, isModalConnexionOpen } from '$lib/stores/modalStore';

    // Les fonctions pour ouvrir/fermer les modales mettent à jour les magasins
    function openModalInscription() {
        isModalInscriptionOpen.set(true);
    }

    function closeModalInscription() {
        isModalInscriptionOpen.set(false);
    }

    function openModalConnexion() {
        isModalConnexionOpen.set(true);
    }

    function closeModalConnexion() {
        isModalConnexionOpen.set(false);
    }
</script>
<section class="acceuil">
<p>
    MarathonMate est l'application idéale pour les cinéphiles qui aiment organiser des marathons de films entre amis.
</p>
<h2>Fonctionnalités principales :</h2>
<ul>
    <li><strong>Créer et organiser des marathons :</strong> Créez des listes de films à regarder et partagez-les avec vos amis.</li>
    <li><strong>Suggérer des films :</strong> Obtenez des recommandations personnalisées en fonction de vos préférences.</li>
    <li><strong>Suivi des marathons :</strong> Suivez la progression de chaque marathon et gardez une trace des films visionnés.</li>
    <li><strong>Gestion des participants :</strong> Invitez vos amis et suivez les confirmations de participation.</li>
</ul>


<div class="button-container">
    <i class="fas fa-film" aria-hidden="true" on:click={openModalInscription} title="S'inscrire"></i>
    <i class="fas fa-video" aria-hidden="true" on:click={openModalConnexion} title="Se connecter"></i>
</div>
</section>
<CarouselComponent />
<!-- Modal pour l'inscription -->
<ModalInscription isOpen={$isModalInscriptionOpen} onClose={closeModalInscription} />

<!-- Modal pour la connexion -->
<ModalConnexion isOpen={$isModalConnexionOpen} onClose={closeModalConnexion} />


<style>
    .acceuil {
        margin: 0;
        padding: 0;
        background-color: #110f0f75;
        color: #000000;
        text-align: justify;
        padding: 1rem;
        border-radius: 2%;
        padding: 1rem;
        margin: 1rem;
        font-weight: bolder;
    }
    p {
        font-size: 0.9rem;
        font-weight: bolder;
        line-height: 1.6;
        margin-bottom: 0.5rem;
        color: #000000;
        text-align: justify;
        padding: 0 0.5rem;
    }
    
    /* Style pour le sous-titre */
    h2 {
        font-size: 1.5rem;
        color: #000000;
        padding: 0rem 1rem;
        font-weight: bolder;
    }
    /* Style pour les listes */
    ul {
        margin-top: 0.2rem;
        padding-left: 1.5rem;
        list-style: none;
        padding: 1rem;
        
    }
    ul li {
        margin-bottom: 0.55rem;
        font-size: 0.8rem;
        position: relative;
        padding-left: 1.5rem;
    }
    strong {
        color: black;
    }
    ul li::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #070707;
        font-size: 1.5rem;
        line-height: 1;
    }
.button-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.5rem;
    justify-content: space-evenly;
    margin-bottom: 0.2rem;
}
.button-container i {
    font-size: 2rem;
    color: #000000;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;
    font-weight: 600;
}

.button-container i:hover {
    color: #f5f5f5;
    transform: scale(1.2) translateY(-5px) rotate(10deg);
}
</style>