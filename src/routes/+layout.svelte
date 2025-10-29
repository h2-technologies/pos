<script lang="ts">
	import '../app.css';
	import favicon from '$lib/icons/favicon.svg';
	import { Navbar, NavBrand, NavHamburger, Button } from "flowbite-svelte";
	import { page } from '$app/state';

	let { children } = $props();
	let activeUrl = $derived(page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar color="none">
	<NavBrand href="/">
		H2 Technologies POS
	</NavBrand>
	<NavHamburger />

	{#if page.data.user != null}
		<Button size="sm" href="/logout">Logout</Button>
	{:else}
		<Button size="sm" href="/login">Login</Button>
	{/if}
</Navbar>

{@render children?.()}
