<script lang="ts">
	import '../app.css';
  import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
  import { userStore } from '$lib/stores/auth';
  import { manifestStore } from '$lib/stores/manifest';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Progress } from '$lib/components/ui/progress';
	import { characterStore } from '$lib/stores/characters';

	let manifestLoading = true;

	onMount(async () => {
		await userStore.init();
		characterStore.init();
		await manifestStore.init();
		
		if ($userStore.destinyMemberships.length > 0) {
			const membership = $userStore.destinyMemberships[0];
			await characterStore.loadCharacterData(membership.membershipType, membership.membershipId);
		}
		
		manifestLoading = false;
	});
</script>

{#if manifestLoading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
		<div class="w-[300px] space-y-4">
			<h2 class="text-center text-xl font-semibold">Loading Destiny 2 Manifest</h2>
			<Progress value={$manifestStore.progress} />
		</div>
	</div>
{/if}

<ModeWatcher />
<Header />
<Toaster />
<slot />