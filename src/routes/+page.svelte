<script lang="ts">
  import { fade } from "svelte/transition";
  import { userStore } from "$lib/stores/auth";
  import { characterStore } from "$lib/stores/characters";
  import CharacterLoadouts from "$lib/components/CharacterLoadouts.svelte";
  import Loadout from "$lib/components/Loadout.svelte";
  import ArmorOptimizer from "$lib/components/ArmorOptimizer.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { writable } from "svelte/store";
  import type { Character, Loadout as LoadoutType } from "$lib/utils/types";

  $: charactersLoaded = Object.keys($characterStore.characters).length > 0;
  $: loadoutsLoaded = Object.keys($characterStore.loadouts).length > 0;

  const selectedLoadout = writable<LoadoutType | null>(null);
  const selectedCharacter = writable<Character | null>(null);

  function handleSelectLoadout(
    event: CustomEvent<{ loadout: LoadoutType; character: Character }>,
  ) {
    selectedLoadout.set(event.detail.loadout);
    selectedCharacter.set(event.detail.character);
  }
</script>

{#if $userStore.bungieNetUser.membershipId}
  <div class="flex h-screen" transition:fade>
    <div class="w-1/2 overflow-y-auto">
      {#if charactersLoaded && loadoutsLoaded}
        <CharacterLoadouts
          on:selectLoadout={handleSelectLoadout}
          selectedLoadout={$selectedLoadout}
        />
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
      {#if $selectedLoadout && $selectedCharacter}
        <Loadout
          loadout={$selectedLoadout}
          loadoutIndex={$characterStore.loadouts[
            $selectedCharacter.characterId
          ].loadouts.indexOf($selectedLoadout)}
          character={$selectedCharacter}
        />
        <ArmorOptimizer />
      {:else}
        <div class="flex h-full items-center justify-center">
          <p class="text-center text-lg text-gray-500">
            Choose a loadout to display details
          </p>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex h-screen items-center justify-center" transition:fade>
    <img
      src="/images/d2ll.webp"
      alt="Destiny 2 Loadout Luminary"
      class="max-w-full max-h-full object-contain"
    />
  </div>
{/if}
