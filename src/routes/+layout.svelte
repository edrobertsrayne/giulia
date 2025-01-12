<script lang="ts">
	import '../app.css';
	import { firekitAuth, firekitUser } from 'svelte-firekit';
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
</script>

<div class="flex h-screen flex-col">
	<nav class="navbar flex-none">
		<div class="flex-1 px-4 text-xl font-bold">Giulia</div>
		<div class="flex-none gap-2">
			{#if firekitUser.isLoggedIn}
				<button class="btn btn-ghost btn-sm" onclick={handleSignOut}>Logout</button>
			{/if}
		</div>
	</nav>
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
				<span>To use Giulia, you must log in with a valid Google accoint.</span>
				<div>
					<button class="btn btn-primary btn-sm" onclick={handleSignIn}>Sign in with Google</button>
				</div>
			</div>
		</div>
	{/if}
</div>
