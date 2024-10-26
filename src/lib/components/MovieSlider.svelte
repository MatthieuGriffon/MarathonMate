<script lang="ts">
    import { onMount } from 'svelte';
    import Carousel from 'svelte-carousel';
    

    type Movie = {
        id: number;
        title: string;
        poster_path: string;
        [key: string]: any;
    };

    let movies: Movie[] = [];
    const apiKey = 'e6c196f97dfe53d83c092738bf907571';

    async function fetchMovies() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`);
        const data = await response.json();
        movies = data.results;
    }

    onMount(() => {
        fetchMovies();
    });
</script>

{#if movies.length > 0}
    <Carousel autoplay={true} autoplayDuration={3000} infinite={true} arrows={false} dots={false}>
        {#each movies as movie}
            <div class="movie-slide">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                
            </div>
        {/each}
    </Carousel>
{/if}

<style>
    .movie-slide {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-top: -5rem;
    }

    .movie-slide img {
        max-width: 60%;
        max-height: 60%;
        border-radius: 8px;
    }
</style>
