<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import { Menu, LogOut } from 'lucide-svelte';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { BUNGIE_BASE_URL } from '$lib/utils/constants';

	function login() {
	  window.location.href = '/auth/login';
	}
	
	async function logout() {
	  const response = await fetch('/api/auth/logout', { method: 'POST' });
	  if (response.ok) {
		userStore.clearUser();
		window.location.href = '/';
	  }
	}
	
	$: avatarSrc = $userStore.bungieNetUser.profilePicturePath 
	  ? `${BUNGIE_BASE_URL}${$userStore.bungieNetUser.profilePicturePath}`
	  : '';
</script>

<header class="w-full py-2 px-4 flex items-center justify-between bg-background border-b">
	<Button variant="ghost" size="icon">
		<Menu class="h-6 w-6" />
	</Button>

	<h1 class="text-xl font-bold">Loadout Luminary</h1>

	<div class="flex items-center space-x-2">
		{#if $userStore.bungieNetUser.membershipId}
			<Avatar>
				<AvatarImage src={avatarSrc} alt={$userStore.bungieNetUser.displayName} />
				<AvatarFallback>{$userStore.bungieNetUser.displayName.charAt(0)}</AvatarFallback>
			</Avatar>
			<Badge variant="secondary">{$userStore.bungieNetUser.displayName}</Badge>
			<Button variant="ghost" size="sm" on:click={logout}><LogOut /></Button>
		{:else}
			<Button variant="ghost" size="sm" on:click={login}>Login with Bungie</Button>
		{/if}
		<LightSwitch />
	</div>
</header>