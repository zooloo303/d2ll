<script lang="ts">
  import { onMount } from 'svelte';
  import { getManifestTable } from '$lib/services/manifest';
  import { inventoryStore } from '$lib/stores/inventory';
  import Item from './Item.svelte';
  import type { Loadout, InventoryItem, ManifestTableName, CompleteInventoryResponse } from '$lib/utils/types';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Skeleton } from '$lib/components/ui/skeleton';

  export let loadout: Loadout;

  let groupedItems: Record<number, InventoryItem[]> = {};
  let loading = true;

  $: if (loadout) {
    groupItems();
  }

  async function groupItems() {
    loading = true;
    const tempGroupedItems: Record<number, InventoryItem[]> = {};

    const itemDefs = await getManifestTable<ManifestTableName>('DestinyInventoryItemDefinition');

    if (itemDefs) {
      const inventoryData: CompleteInventoryResponse | null = $inventoryStore;

      if (inventoryData) {
        for (const loadoutItem of loadout.items) {
          const item = findItemInInventory(inventoryData, loadoutItem.itemInstanceId);
          if (item) {
            const itemDef = itemDefs[item.itemHash];
            if (itemDef && typeof itemDef.itemType === 'number') {
              if (!tempGroupedItems[itemDef.itemType]) {
                tempGroupedItems[itemDef.itemType] = [];
              }
              tempGroupedItems[itemDef.itemType].push(item);
            }
          }
        }
      }
    }

    groupedItems = tempGroupedItems;
    loading = false;
  }

  function findItemInInventory(inventoryData: CompleteInventoryResponse | null, itemInstanceId: string): InventoryItem | undefined {
    if (!inventoryData) return undefined;
    // Check in profile inventory
    let item = inventoryData.profileInventory.items.find(i => i.itemInstanceId === itemInstanceId);
    if (item) return item;

    // Check in character inventories
    for (const characterId in inventoryData.characterInventories) {
      item = inventoryData.characterInventories[characterId].items.find(i => i.itemInstanceId === itemInstanceId);
      if (item) return item;
    }

    // Check in character equipment
    for (const characterId in inventoryData.characterEquipment) {
      item = inventoryData.characterEquipment[characterId].items.find(i => i.itemInstanceId === itemInstanceId);
      if (item) return item;
    }

    return undefined;
  }

  function getItemTypeName(itemType: number): string {
    switch (itemType) {
      case 16:
        return 'Subclass';
      case 3:
        return 'Weapons';
      case 2:
        return 'Armor';
      default:
        return 'Other';
    }
  }

  onMount(() => {
    groupItems();
  });
</script>

{#if loading}
  <div class="flex h-screen items-center justify-center">
    <div class="flex items-center space-x-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </div>
{:else}
  <div class="p-4">
    {#each Object.entries(groupedItems) as [itemType, items] (itemType)}
      <Card class="mb-4">
        <CardContent>
          <h3 class="mb-2 text-lg font-semibold">{getItemTypeName(parseInt(itemType))}</h3>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {#each items as item (item.itemInstanceId)}
              <Item {item} />
            {/each}
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>
{/if}
