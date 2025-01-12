<script lang="ts">
	import '../app.css';
	import { firekitAuth, firekitUser } from 'svelte-firekit';
	import { setContext } from 'svelte';
	import { localStore } from '$lib/localstore.svelte';
	import NavBar from './NavBar.svelte';
	import LoginAlert from './LoginAlert.svelte';

	let { children } = $props();

	async function handleSignOut() {
		try {
			await firekitAuth.logOut();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	function toggleTextToSpeech() {
		enableTextToSpeech.value = !enableTextToSpeech.value;
	}

	let enableTextToSpeech = localStore('enableTextToSpeech', false);
	setContext('enableTextToSpeech', enableTextToSpeech);
</script>

<div class="drawer h-screen">
	<input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<NavBar />

		<!-- Main Content -->
		{#if firekitUser.isLoggedIn}
			{@render children()}
		{:else}
			<LoginAlert />
		{/if}
	</div>

	<!-- Drawer Sidebar -->
	<div class="drawer-side h-screen">
		<label for="drawer-toggle" class="drawer-overlay"></label>
		<ul class="menu h-full w-80 bg-base-100 p-4 text-base-content">
			<!-- Sidebar content -->
			<li>
				<button onclick={toggleTextToSpeech}
					>{enableTextToSpeech.value ? 'Disable' : 'Enable'} Text to Speech</button
				>
			</li>
			<li><button onclick={handleSignOut}>Logout</button></li>
		</ul>
	</div>
</div>
