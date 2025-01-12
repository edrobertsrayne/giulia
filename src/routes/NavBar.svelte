<script lang="ts">
	import { firekitUser } from 'svelte-firekit';
</script>

<nav class="navbar flex-none bg-base-200">
	<div class="flex-none {firekitUser.isLoggedIn ? '' : 'hidden'}">
		<label for="drawer-toggle" class="btn btn-ghost drawer-button btn-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-6 w-6 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path>
			</svg>
		</label>
	</div>
	<div class="mx-2 flex-1 px-2 text-xl font-bold">Giulia</div>
</nav>
