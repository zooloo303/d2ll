<script lang="ts">
  import { onMount } from "svelte";
  import { getManifestTable } from "$lib/services/manifest";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import { inventoryStore } from "$lib/stores/inventory";
  import type {
    InventoryItem,
    ManifestTableName,
    ItemInstance,
    ItemDefinition,
    ItemStats,
    StatDefinition,
  } from "$lib/utils/types";
  import { lazyLoad } from "$lib/utils/helpers";
  import ItemHoverCard from "./ItemHoverCard.svelte";

  export let item: InventoryItem;

  let itemDefinition: ItemDefinition | null = null;
  let overrideItemDefinition: ItemDefinition | null = null;
  let damageTypeDefinition: any | null = null;
  let itemInstance: ItemInstance | null = null;
  let itemStats: ItemStats | null = null;
  let statDefinitions: { [statHash: string]: StatDefinition } | null = null;
  let loaded = false;

  onMount(async () => {
    const itemDefs = await getManifestTable<ItemDefinition>("DestinyInventoryItemDefinition");
    if (itemDefs) {
      itemDefinition = itemDefs[item.itemHash];
      if (item.overrideStyleItemHash) {
        overrideItemDefinition = itemDefs[item.overrideStyleItemHash];
      }
    }

    if (itemDefinition?.defaultDamageTypeHash) {
      const damageDefs = await getManifestTable<ManifestTableName>(
        "DestinyDamageTypeDefinition",
      );
      if (damageDefs) {
        damageTypeDefinition = damageDefs[itemDefinition.defaultDamageTypeHash];
      }
    }

    const inventoryData = $inventoryStore;
    if (
      inventoryData &&
      inventoryData.itemComponents.instances.data[item.itemInstanceId] &&
      inventoryData.itemComponents.stats.data[item.itemInstanceId]
    ) {
      itemInstance =
        inventoryData.itemComponents.instances.data[item.itemInstanceId];
      itemStats =
        inventoryData.itemComponents.stats.data[item.itemInstanceId].stats;
    }

    // Fetch stat definitions
    const statDefs = await getManifestTable<StatDefinition>("DestinyStatDefinition");
    if (statDefs) {
      statDefinitions = statDefs;
    }

    loaded = true;
  });

  $: powerLevel = itemInstance?.primaryStat?.value ?? "N/A";
  $: iconPath =
    overrideItemDefinition?.displayProperties.icon ||
    itemDefinition?.displayProperties.icon;
</script>

{#if loaded && itemDefinition}
  <ItemHoverCard {itemDefinition} {itemInstance} {itemStats} {overrideItemDefinition}>
    <div class="flex items-center rounded-md bg-secondary p-2">
      <img
        use:lazyLoad
        data-src={`${BUNGIE_BASE_URL}${iconPath}`}
        alt={itemDefinition.displayProperties.name}
        class="mr-2 h-12 w-12"
      />
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
