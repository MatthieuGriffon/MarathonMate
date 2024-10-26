<!-- src/routes/+page.svelte -->
<style>
    p {
        font-size: 0.9rem;
        font-weight: bolder;
        line-height: 1.6;
        margin-bottom: 1rem;
        color: #444;
        text-align: justify;
        padding: 0 1rem;
    }
    h1 {
        font-size: 1.5rem;
        text-align: center;
        color: black;
        margin-bottom: 1.5rem;
        font-weight: bolder;
    }
    /* Style pour le sous-titre */
    h2 {
        font-size: 1.5rem;
        margin-top: 2rem;
        color: #333;
        padding: 1rem;
        font-weight: bolder;
    }
    /* Style pour les listes */
    ul {
        margin-top: 1rem;
        padding-left: 1.5rem;
        list-style: none;
        padding: 1rem;
        
    }
    ul li {
        margin-bottom: 0.75rem;
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
        color: #321ab9;
        font-size: 1.5rem;
        line-height: 1;
    }
.button-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: space-evenly;
}
.button-container i {
    font-size: 2rem;
    color: #000000;
    cursor: pointer;
    transition: color 0.3s ease;
}

.button-container i:hover {
    color: #000000;
}

</style>


<h1>Bienvenue sur <strong>MarathonMate</strong> !</h1>

<p>
    MarathonMate est l'application idéale pour les cinéphiles qui aiment organiser des marathons de films entre amis.
</p>
<p>
    Que ce soit pour une soirée à thème, un événement spécial ou simplement pour découvrir les classiques du cinéma, 
    MarathonMate vous aide à planifier et à partager vos sessions de visionnage.
</p>

<h2>Fonctionnalités principales :</h2>
<ul>
    <li><strong>Créer et organiser des marathons :</strong> Créez des listes de films à regarder et partagez-les avec vos amis.</li>
    <li><strong>Suggérer des films :</strong> Obtenez des recommandations personnalisées en fonction de vos préférences.</li>
    <li><strong>Suivi des marathons :</strong> Suivez la progression de chaque marathon et gardez une trace des films visionnés.</li>
    <li><strong>Gestion des participants :</strong> Invitez vos amis et suivez les confirmations de participation.</li>
</ul>

<p>
    Avec MarathonMate, transformez chaque soirée cinéma en une expérience mémorable. 
    Rejoignez-nous dès maintenant et commencez à organiser vos marathons de films !
</p>
<div class="button-container">
    <i class="fas fa-film" aria-hidden="true" on:click={() => alert('Redirection vers l\'inscription...')} title="S'inscrire"></i>
    <i class="fas fa-video" aria-hidden="true" on:click={() => alert('Redirection vers la connexion...')} title="Se connecter"></i>
</div>
