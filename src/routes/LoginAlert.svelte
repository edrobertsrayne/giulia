<script lang="ts">
	import { firekitAuth } from 'svelte-firekit';
	async function handleSignIn() {
		try {
			await firekitAuth.signInWithGoogle();
		} catch (error) {
			console.error('Authentication failed:', error);
		}
	}
</script>

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
			<button class="btn btn-primary btn-sm" onclick={handleSignIn}>Sign in with Google</button>
		</div>
	</div>
</div>
