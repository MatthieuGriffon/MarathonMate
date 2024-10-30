import { json } from '@sveltejs/kit';

const apiKey = 'e6c196f97dfe53d83c092738bf907571';
const apiUrl = 'https://api.themoviedb.org/3';

export const GET = async ({ url }) => {
    const query = url.searchParams.get('q');

    if (!query) {
        return json({ error: 'Aucun paramètre de recherche fourni' }, { status: 400 });
    }

    try {
        // Ajout de &language=fr-FR pour obtenir les résultats en français
        const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr-FR`);

        if (!response.ok) {
            return json({ error: 'Erreur lors de la récupération des films' }, { status: 500 });
        }

        const data = await response.json();
        const movies = data.results.map((movie: TmdbMovie) => ({
            id: movie.id,
            title: movie.title, // Titre en français
            releaseDate: movie.release_date,
            overview: movie.overview,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
        }));

        return json(movies);
    } catch (error) {
        console.error('Erreur lors de la requête TMDb:', error);
        return json({ error: 'Erreur de serveur' }, { status: 500 });
    }
};
