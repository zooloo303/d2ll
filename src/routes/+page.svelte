<script lang="ts">
  import { characterStore } from "$lib/stores/characters";
  import CharacterLoadouts from "$lib/components/CharacterLoadout.svelte";
  import Loadout from "$lib/components/Loadout.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { writable } from "svelte/store";

  $: charactersLoaded = Object.keys($characterStore.characters).length > 0;
  $: loadoutsLoaded = Object.keys($characterStore.loadouts).length > 0;

  const selectedLoadout = writable(null);

  function handleSelectLoadout(event: { detail: null; }) {
    selectedLoadout.set(event.detail);
  }
</script>

<div class="flex h-screen">
  <div class="w-1/2 overflow-y-auto">
    {#if charactersLoaded && loadoutsLoaded}
      <CharacterLoadouts on:selectLoadout={handleSelectLoadout} />
    {:else if $characterStore.lastUpdated === 0}
      <div class="space-y-2">
        <Skeleton class="h-12 w-full" />
        <Skeleton class="h-12 w-full" />
        <Skeleton class="h-12 w-full" />
      </div>
    {:else}
      <p>Error loading character data. Please try again later.</p>
    {/if}
  </div>
  <div class="w-1/2 overflow-y-auto">
    {#if $selectedLoadout}
      <Loadout loadout={$selectedLoadout} />
    {:else}
      <div class="flex h-full items-center justify-center">
        <p class="text-center text-lg text-gray-500">Choose a loadout to display details</p>
      </div>
    {/if}
  </div>
</div>
