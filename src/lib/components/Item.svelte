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
  let isCompact = false;

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

  // Add a function to check if the component should be in compact mode
  function checkCompactMode() {
    isCompact = window.innerWidth < 640; // Adjust this breakpoint as needed
  }

  onMount(() => {
    checkCompactMode();
    window.addEventListener('resize', checkCompactMode);
    return () => window.removeEventListener('resize', checkCompactMode);
  });

  // ... rest of the existing script ...
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
    <div class="flex items-center rounded-md bg-secondary p-2 gap-2">
      {#key iconPath}
        <img
          use:lazyLoad
          data-src={`${BUNGIE_BASE_URL}${iconPath}`}
          alt={itemDefinition.displayProperties.name}
          class="h-10 w-10 flex-shrink-0"
        />
      {/key}
      {#if !isCompact}
        <div class="flex-grow min-w-0">
          <p class="text-sm font-semibold truncate">
            {itemDefinition.displayProperties.name}
          </p>
          <p class="text-xs text-muted-foreground">Power: {powerLevel}</p>
        </div>
      {/if}
      {#if damageTypeDefinition}
        <img
          use:lazyLoad
          data-src={`${BUNGIE_BASE_URL}${damageTypeDefinition.displayProperties.icon}`}
          alt={damageTypeDefinition.displayProperties.name}
          class="h-5 w-5 flex-shrink-0"
        />
      {/if}
    </div>
  </ItemHoverCard>
{:else}
  <Skeleton class="h-12 w-full rounded-md" />
{/if}
