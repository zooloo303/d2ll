<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/auth";
  import { characterStore } from "$lib/stores/characters";
  import { inventoryStore } from "$lib/stores/inventory";
  import { manifestStore } from "$lib/stores/manifest";
  import ExoticArmorSelector from "./ExoticArmorSelector.svelte";
  import StatPriorityDragDrop from "./StatPriorityDragDrop.svelte";
  import SubclassSelector from "./SubclassSelector.svelte";
  import OptimizationResults from "./OptimizationResults.svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import type {
    Character,
    InventoryItem,
    DestinyInventoryItemDefinition,
  } from "$lib/utils/types";
  import { optimizeArmor } from "$lib/services/armorOptimizer";

  let selectedExotic: string | null = null;
  let statPriorities: string[] = [];
  let selectedSubclass: string | null = null;
  let optimizedLoadout: InventoryItem[] | null = null;
  let characters: Character[] = [];
  let selectedCharacter: Character | null = null;
  let exoticArmorItems: InventoryItem[] = [];
  let armorDefinitions: Record<string, DestinyInventoryItemDefinition> = {};

  $: if (selectedCharacter) {
    loadExoticArmor(selectedCharacter);
  }

  onMount(async () => {
    if ($userStore.destinyMemberships.length > 0) {
      const membership = $userStore.destinyMemberships[0];
      await characterStore.loadCharacterData(
        membership.membershipType,
        membership.membershipId,
      );
      await inventoryStore.loadInventoryData(
        membership.membershipType,
        membership.membershipId,
      );
    }
    characters = Object.values($characterStore.characters);
    selectedCharacter = characters[0] || null;

    armorDefinitions =
      await manifestStore.getTable<DestinyInventoryItemDefinition>(
        "DestinyInventoryItemDefinition",
      );
  });

  async function loadExoticArmor(character: Character) {
    const inventoryData = $inventoryStore;
    if (!inventoryData || !armorDefinitions) return;

    exoticArmorItems = [
      ...inventoryData.characterInventories[character.characterId].items,
      ...inventoryData.characterEquipment[character.characterId].items,
      ...inventoryData.profileInventory.items,
    ].filter((item) => {
      const itemDef = armorDefinitions[item.itemHash];
      return (
        itemDef &&
        itemDef.inventory.tierType === 6 &&
        itemDef.itemType === 2 &&
        (itemDef.classType === character.classType || itemDef.classType === 3)
      );
    });
  }

  async function handleOptimize() {
    if (
      !selectedCharacter ||
      !selectedSubclass ||
      statPriorities.length === 0
    ) {
      console.error("Missing required optimization parameters");
      return;
    }

    optimizedLoadout = await optimizeArmor(
      selectedCharacter,
      selectedExotic,
      statPriorities,
      selectedSubclass,
      $inventoryStore,
    );
  }
</script>

<Card class="w-full max-w-4xl mx-auto">
  <CardHeader>
    <CardTitle>Armor Optimizer</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="space-y-6">
      <div>
        <label
          for="character-select"
          class="block text-sm font-medium text-gray-700"
          >Select Character</label
        >
        <select
          id="character-select"
          bind:value={selectedCharacter}
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {#each characters as character}
            <option value={character}>{character.classType}</option>
          {/each}
        </select>
      </div>

      {#if selectedCharacter}
        <ExoticArmorSelector
          items={exoticArmorItems}
          onSelect={(itemInstanceId) => (selectedExotic = itemInstanceId)}
        />
        <div class="flex flex-row items-center m-2 justify-center">
          <StatPriorityDragDrop
            onPrioritiesChange={(priorities) => (statPriorities = priorities)}
          />

          <SubclassSelector
            characterId={selectedCharacter.characterId}
            onSelect={(subclassHash) => (selectedSubclass = subclassHash)}
          />
        </div>

        <Button on:click={handleOptimize}>Optimize Armor</Button>

        {#if optimizedLoadout}
          <OptimizationResults loadout={optimizedLoadout} />
        {/if}
      {/if}
    </div>
  </CardContent>
</Card>
