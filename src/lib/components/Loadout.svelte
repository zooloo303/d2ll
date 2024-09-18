<script lang="ts">
  import { onMount } from "svelte";
  import Item from "./Item.svelte";
  import LoadoutActions from "./LoadoutActions.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { inventoryStore } from "$lib/stores/inventory";
  import { getManifestTable } from "$lib/services/manifest";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { findItemInInventory, groupItemsBy } from "$lib/utils/helpers";
  import type {
    Loadout,
    Character,
    InventoryItem,
    CompleteInventoryResponse,
    DestinyInventoryItemDefinition,
  } from "$lib/utils/types";

  export let loadout: Loadout;
  export let loadoutIndex: number;
  export let character: Character;

  let groupedItems: Record<number, InventoryItem[]> = {};
  let loading = true;
  let itemDefs: Record<string, DestinyInventoryItemDefinition> | null = null;

  $: if (loadout && itemDefs) {
    console.time("groupItems");
    groupItems();
    console.timeEnd("groupItems");
  }

  async function groupItems() {
    loading = true;
    let tempGroupedItems: Record<number, InventoryItem[]> = {};

    if (itemDefs) {
      const inventoryData: CompleteInventoryResponse | null = $inventoryStore;

      if (inventoryData) {
        const loadoutItems = loadout.items
          .map((loadoutItem) => {
            const foundItemData = findItemInInventory(
              inventoryData,
              loadoutItem.itemInstanceId,
            );
            return foundItemData ? foundItemData.item : undefined;
          })
          .filter((item): item is InventoryItem => item !== undefined);

        tempGroupedItems = groupItemsBy(loadoutItems, (item) => {
          const itemDef = itemDefs[item.itemHash];
          return itemDef && typeof itemDef.itemType === "number"
            ? itemDef.itemType
            : -1;
        });
      }
    }

    groupedItems = tempGroupedItems;
    loading = false;
  }

  const itemTypeNames: Record<number, string> = {
    16: "Subclass",
    3: "Weapons",
    2: "Armor",
  };

  function getItemTypeName(itemType: number): string {
    return itemTypeNames[itemType] || "Other";
  }

  onMount(async () => {
    console.time("fetchManifest");
    itemDefs = await getManifestTable<DestinyInventoryItemDefinition>(
      "DestinyInventoryItemDefinition",
    );
    console.timeEnd("fetchManifest");
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
          <h3 class="mb-2 text-lg font-semibold">
            {getItemTypeName(parseInt(itemType))}
          </h3>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {#each items as item (item.itemInstanceId)}
              <Item {item} />
            {/each}
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>
  <div class="pl-4 pr-4">
    <LoadoutActions {loadout} {loadoutIndex} {character} />
  </div>
{/if}
