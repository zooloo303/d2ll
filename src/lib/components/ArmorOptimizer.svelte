<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "$lib/stores/auth";
  import { characterStore } from "$lib/stores/characters";
  import { inventoryStore } from "$lib/stores/inventory";
  import { manifestStore } from "$lib/stores/manifest";
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
  import { Avatar, AvatarImage } from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import type {
    Character,
    InventoryItem,
    Loadout,
    ItemInstance,
    ItemStats,
    DestinyInventoryItemDefinition
  } from "$lib/utils/types";
  import { optimizeArmor } from "$lib/services/armorOptimizer";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import Item from "$lib/components/Item.svelte";
  import { getLegendaryArmorForClass } from "$lib/utils/helpers";
  import { WARLOCK_SUBCLASSES, HUNTER_SUBCLASSES, TITAN_SUBCLASSES } from "$lib/utils/constants";

  export let characterId: string;
  export let loadout: Loadout;

  let selectedExotic: string | null = null;
  let statPriorities: string[] = [];
  let selectedSubclass: string | null = null;
  let optimizedLoadout: InventoryItem[] | null = null;
  let selectedCharacter: Character | null = null;
  let exoticArmorItem: InventoryItem | null = null;
  let legendaryArmor: { item: InventoryItem; instance: ItemInstance; stats: ItemStats; definition: DestinyInventoryItemDefinition }[] = [];
  let defaultSubclass: string | null = null;

  $: if (characterId) {
    updateSelectedCharacter();
  }

  $: if (loadout && $manifestStore.tables.DestinyInventoryItemDefinition) {
    loadExoticArmor();
    loadDefaultSubclass();
  }

  async function updateSelectedCharacter() {
    selectedCharacter = $characterStore.characters[characterId] || null;
    if (selectedCharacter) {
      await loadExoticArmor();
      // Reset other selections when character changes
      selectedSubclass = null;
      optimizedLoadout = null;
    }
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

    if (!$manifestStore.tables.DestinyInventoryItemDefinition) {
      await manifestStore.getTable('DestinyInventoryItemDefinition');
    }
    
    await updateSelectedCharacter();
  });

  async function loadExoticArmor() {
    const inventoryData = $inventoryStore;
    if (!inventoryData || !$manifestStore.tables.DestinyInventoryItemDefinition) return;

    exoticArmorItem = null;
    selectedExotic = null;

    for (const item of loadout.items) {
      const inventoryItem = findItemInInventory(inventoryData, item.itemInstanceId);
      if (inventoryItem) {
        const itemDef = $manifestStore.tables.DestinyInventoryItemDefinition[inventoryItem.itemHash];
        if (itemDef && itemDef.inventory.tierType === 6 && itemDef.itemType === 2) {
          exoticArmorItem = inventoryItem;
          selectedExotic = item.itemInstanceId;
          break;
        }
      }
    }
  }

  function findItemInInventory(inventoryData, itemInstanceId) {
    for (const location of ['characterInventories', 'characterEquipment', 'profileInventory']) {
      if (location === 'profileInventory') {
        const item = inventoryData[location].items.find(i => i.itemInstanceId === itemInstanceId);
        if (item) return item;
      } else {
        for (const characterId in inventoryData[location]) {
          const item = inventoryData[location][characterId].items.find(i => i.itemInstanceId === itemInstanceId);
          if (item) return item;
        }
      }
    }
    return null;
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

  function getClassName(classType: number): string {
    switch (classType) {
      case 0:
        return "Titan";
      case 1:
        return "Hunter";
      case 2:
        return "Warlock";
      default:
        return "Unknown";
    }
  }
  function loadDefaultSubclass() {
    let newDefaultSubclass: string | null = null;
    for (const item of loadout.items) {
      const inventoryItem = findItemInInventory($inventoryStore, item.itemInstanceId);
      if (inventoryItem) {
        const itemDef = $manifestStore.tables.DestinyInventoryItemDefinition[inventoryItem.itemHash];
        if (itemDef && itemDef.itemType === 16) { // 16 is the itemType for subclasses
          newDefaultSubclass = inventoryItem.itemHash.toString();
          break;
        }
      }
    }
    defaultSubclass = newDefaultSubclass;
    selectedSubclass = newDefaultSubclass; // Reset selected subclass when loadout changes
  }

  function handleSubclassSelect(subclassHash: string) {
    selectedSubclass = subclassHash;
  }

  function getSubclassesForClass(classType: number): Record<number, string> {
    switch (classType) {
      case 0:
        return TITAN_SUBCLASSES;
      case 1:
        return HUNTER_SUBCLASSES;
      case 2:
        return WARLOCK_SUBCLASSES;
      default:
        return {};
    }
  }

  function handleStatPrioritiesChange(priorities: string[]) {
    statPriorities = priorities;
    console.log("Updated stat priorities:", statPriorities);
  }

  $: if ($inventoryStore && $manifestStore.tables.DestinyInventoryItemDefinition && selectedCharacter) {
    legendaryArmor = getLegendaryArmorForClass(
      $inventoryStore,
      selectedCharacter.classType,
      $manifestStore.tables.DestinyInventoryItemDefinition
    );
    
    console.log("Legendary Armor:", legendaryArmor);
  }
</script>
<div class="p-4">

<Card class="w-full mx-auto">
  <CardHeader>
    <CardTitle>Armor Optimizer</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="space-y-6">
      {#if selectedCharacter}
        <div class="flex items-center space-x-4 justify-between">
          <div class="flex items-center space-x-4 justify-between">
          <Avatar class="h-16 w-16">
            <AvatarImage
              src={`${BUNGIE_BASE_URL}${selectedCharacter.emblemPath}`}
              alt="Character Emblem"
            />
          </Avatar>
          <Badge>{getClassName(selectedCharacter.classType)}</Badge>
        </div>
          {#if exoticArmorItem}
            <Item item={exoticArmorItem} />
          {/if}
          

          <StatPriorityDragDrop
            onPrioritiesChange={handleStatPrioritiesChange}
          />

          <SubclassSelector
            characterId={selectedCharacter.characterId}
            onSelect={handleSubclassSelect}
            defaultSubclass={defaultSubclass}
            bind:selectedSubclass
            subclasses={getSubclassesForClass(selectedCharacter.classType)}
          />
        </div>

        <Button variant="ghost" on:click={handleOptimize}>Optimize Armor</Button>

        {#if optimizedLoadout}
          <OptimizationResults loadout={optimizedLoadout} />
        {/if}
      {:else}
        <p>Error: Character not found</p>
      {/if}
    </div>
  </CardContent>
</Card>
</div>
