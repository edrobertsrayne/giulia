<script lang="ts">
	import '../app.css';
	import { firekitAuth, firekitUser } from 'svelte-firekit';
	import { setContext } from 'svelte';
	import { localStore } from '$lib/localstore.svelte';
	import NavBar from './NavBar.svelte';

	let { children } = $props();

	async function handleSignIn() {
		try {
			await firekitAuth.signInWithGoogle();
		} catch (error) {
			console.error('Authentication failed:', error);
		}
	}

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
			<div class="m-8">
				<div role="alert " class="alert">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="h-6 w-6 shrink-0 stroke-info"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>To use Giulia, you must log in with a valid Google account.</span>
					<div>
						<button class="btn btn-primary btn-sm" onclick={handleSignIn}
							>Sign in with Google</button
						>
					</div>
				</div>
			</div>
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
