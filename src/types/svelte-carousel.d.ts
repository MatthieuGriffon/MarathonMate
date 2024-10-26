declare module 'svelte-carousel' {
    import { SvelteComponentTyped } from 'svelte';
    export default class Carousel extends SvelteComponentTyped<{
        autoplay?: boolean;
        autoplayDuration?: number;
        infinite?: boolean;
        arrows?: boolean;
        dots?: boolean;
        [key: string]: unknown;
    }> {}
}