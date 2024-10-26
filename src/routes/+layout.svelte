<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
</script>

<ParaglideJS {i18n}>
	<Header />
	<slot />
	<Footer />
</ParaglideJS>

<style>
	  
</style>