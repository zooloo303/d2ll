<script lang="ts">
  import { characterStore } from "$lib/stores/characters";
  import CharacterLoadouts from "$lib/components/CharacterLoadout.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  $: charactersLoaded = Object.keys($characterStore.characters).length > 0;
  $: loadoutsLoaded = Object.keys($characterStore.loadouts).length > 0;
</script>

{#if charactersLoaded && loadoutsLoaded}
  <CharacterLoadouts />
{:else if $characterStore.lastUpdated === 0}
  <div class="space-y-2">
    <Skeleton class="h-12 w-full" />
    <Skeleton class="h-12 w-full" />
    <Skeleton class="h-12 w-full" />
  </div>
{:else}
  <p>Error loading character data. Please try again later.</p>
{/if}
