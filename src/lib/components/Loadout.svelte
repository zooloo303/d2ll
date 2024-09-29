<script lang="ts">
  import { onMount } from "svelte";
  import Item from "./Item.svelte";
  import LoadoutActions from "./LoadoutActions.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { inventoryStore } from "$lib/stores/inventory";
  import { manifestStore } from "$lib/stores/manifest";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { findItemInInventory, groupItemsBy } from "$lib/utils/helpers";
  import { Tooltip, TooltipContent, TooltipTrigger } from "$lib/components/ui/tooltip";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import type {
    Loadout,
    Character,
    InventoryItem,
    DestinyInventoryItemDefinition,
  } from "$lib/utils/types";

  export let loadout: Loadout;
  export let loadoutIndex: number;
  export let character: Character;

  let groupedItems: Record<string, InventoryItem[]> = {};
  let loading = true;

  $: itemDefs = $manifestStore.tables.DestinyInventoryItemDefinition;
  $: inventoryData = $inventoryStore;

  let prevLoadout: Loadout | null = null;

  $: if (loadout !== prevLoadout && itemDefs && inventoryData) {
    prevLoadout = loadout;
    groupItems();
  }

  function groupItems() {
    console.time("groupItems");
    let tempGroupedItems: Record<string, InventoryItem[]> = {};

    if (itemDefs && inventoryData) {
      const loadoutItems = loadout.items
        .map((loadoutItem) => {
          const foundItemData = findItemInInventory(
            inventoryData,
            loadoutItem.itemInstanceId,
          );
          return foundItemData ? { ...foundItemData.item, plugItemHashes: loadoutItem.plugItemHashes } : undefined;
        })
        .filter((item): item is InventoryItem => item !== undefined);

      tempGroupedItems = groupItemsBy(loadoutItems, (item) => {
        const itemDef = itemDefs[item.itemHash];
        if (itemDef.itemType === 16) return "Subclass";
        if (itemDef.itemType === 2) return "Armor";
        if (itemDef.itemType === 3) return "Weapons";
        return "Other";
      });
    }

    groupedItems = tempGroupedItems;
    loading = false;
    console.timeEnd("groupItems");
  }

  const itemTypeOrder = ["Subclass", "Armor", "Weapons", "Other"];

  function getPlugIcon(plugHash: number): string | null {
    const plugDef = itemDefs[plugHash];
    return plugDef ? `${BUNGIE_BASE_URL}${plugDef.displayProperties.icon}` : null;
  }

  function getPlugName(plugHash: number): string | null {
    const plugDef = itemDefs[plugHash];
    return plugDef ? plugDef.displayProperties.name : null;
  }

  // Remove this line
  // const iconSize = "w-10 h-10";

  // Add this new responsive icon size
  const responsiveIconSize = "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10";

  onMount(() => {
    if (itemDefs && inventoryData) {
      groupItems();
    }
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
    {#each itemTypeOrder as itemType}
      {#if groupedItems[itemType] && groupedItems[itemType].length > 0}
        <Card class="mb-4">
          <CardContent>
            <h3 class="mb-2 text-lg font-semibold">{itemType}</h3>
            <div class="space-y-2">
              {#each groupedItems[itemType] as item (item.itemInstanceId)}
                <div class="flex items-center space-x-2">
                  <Item {item} />
                  {#if item.plugItemHashes && item.plugItemHashes.length > 0}
                    <div class="flex flex-wrap gap-1 sm:gap-2"> <!-- Changed space-x-2 to gap-1 and sm:gap-2 for better responsiveness -->
                      {#each item.plugItemHashes as plugHash}
                        {@const plugIcon = getPlugIcon(plugHash)}
                        {@const plugName = getPlugName(plugHash)}
                        {#if plugIcon && plugName}
                          <Tooltip>
                            <TooltipTrigger>
                              <img src={plugIcon} alt={plugName} class={responsiveIconSize} /> <!-- Applied new responsive icon size -->
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{plugName}</p>
                            </TooltipContent>
                          </Tooltip>
                        {/if}
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/if}
    {/each}
  </div>
  <div class="pl-4 pr-4">
    <LoadoutActions {loadout} {loadoutIndex} {character} />
  </div>
{/if}
