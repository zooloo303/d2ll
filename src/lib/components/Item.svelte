<script lang="ts">
  import { onMount } from "svelte";
  import { manifestStore } from "$lib/stores/manifest";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import { inventoryStore } from "$lib/stores/inventory";
  import type { InventoryItem } from "$lib/utils/types";
  import { lazyLoad } from "$lib/utils/helpers";
  import ItemHoverCard from "./ItemHoverCard.svelte";

  export let item: InventoryItem;

  let loaded = false;
  let iconPath: string;

  $: itemDefinition = $manifestStore.tables.DestinyInventoryItemDefinition?.[item.itemHash];
  $: overrideItemDefinition = item.overrideStyleItemHash ? 
    $manifestStore.tables.DestinyInventoryItemDefinition?.[item.overrideStyleItemHash] : null;
  $: damageTypeDefinition = itemDefinition?.defaultDamageTypeHash ? 
    $manifestStore.tables.DestinyDamageTypeDefinition?.[itemDefinition.defaultDamageTypeHash as keyof typeof $manifestStore.tables.DestinyDamageTypeDefinition] : null;

  $: itemInstance = $inventoryStore?.itemComponents.instances.data[item.itemInstanceId];
  $: itemStats = $inventoryStore?.itemComponents.stats.data[item.itemInstanceId]?.stats;
  $: statDefinitions = $manifestStore.tables.DestinyStatDefinition;

  $: powerLevel = itemInstance?.primaryStat?.value ?? "N/A";
  $: socketData = $inventoryStore?.itemComponents.sockets.data[item.itemInstanceId]?.sockets;

  $: {
    // Update iconPath whenever item, overrideItemDefinition, or itemDefinition changes
    iconPath = overrideItemDefinition?.displayProperties.icon || itemDefinition?.displayProperties.icon;
    // Force a re-render of the img element
    loaded = false;
    setTimeout(() => loaded = true, 0);
  }

  onMount(async () => {
    if (!$manifestStore.tables.DestinyInventoryItemDefinition) {
      await manifestStore.getTable('DestinyInventoryItemDefinition');
    }
    if (!$manifestStore.tables.DestinyDamageTypeDefinition) {
      await manifestStore.getTable('DestinyDamageTypeDefinition');
    }
    if (!$manifestStore.tables.DestinyStatDefinition) {
      await manifestStore.getTable('DestinyStatDefinition');
    }
    loaded = true;
  });
</script>

{#if loaded && itemDefinition}
  <ItemHoverCard
    {itemDefinition}
    {itemInstance}
    {itemStats}
    {overrideItemDefinition}
    itemSockets={socketData}
    itemInstanceId={item.itemInstanceId}
  >
    <div class="flex items-center rounded-md bg-secondary p-2">
      {#key iconPath}
        <img
          use:lazyLoad
          data-src={`${BUNGIE_BASE_URL}${iconPath}`}
          alt={itemDefinition.displayProperties.name}
          class="mr-2 h-12 w-12"
        />
      {/key}
      <div class="flex-grow">
        <p class="text-sm font-semibold">
          {itemDefinition.displayProperties.name}
        </p>
        <p class="text-xs text-muted-foreground">Power: {powerLevel}</p>
      </div>
      {#if damageTypeDefinition}
        <img
          use:lazyLoad
          data-src={`${BUNGIE_BASE_URL}${damageTypeDefinition.displayProperties.icon}`}
          alt={damageTypeDefinition.displayProperties.name}
          class="h-6 w-6"
        />
      {/if}
    </div>
  </ItemHoverCard>
{:else}
  <Skeleton class="h-12 w-full rounded-md" />
{/if}
