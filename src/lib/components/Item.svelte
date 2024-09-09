<script lang="ts">
  import { onMount } from 'svelte';
  import { getManifestTable } from '$lib/services/manifest';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { BUNGIE_BASE_URL } from '$lib/utils/constants';
  import { inventoryStore } from '$lib/stores/inventory';
  import type { InventoryItem, ManifestTableName, ItemInstance } from '$lib/utils/types';

  export let item: InventoryItem;

  let itemDefinition: any | null = null;
  let overrideItemDefinition: any | null = null;
  let damageTypeDefinition: any | null = null;
  let itemInstance: ItemInstance | null = null;

  onMount(async () => {
    const itemDefs = await getManifestTable<ManifestTableName>('DestinyInventoryItemDefinition');
    if (itemDefs) {
      itemDefinition = itemDefs[item.itemHash];
      if (item.overrideStyleItemHash) {
        overrideItemDefinition = itemDefs[item.overrideStyleItemHash];
      }
    }

    if (itemDefinition?.defaultDamageTypeHash) {
      const damageDefs = await getManifestTable<ManifestTableName>('DestinyDamageTypeDefinition');
      if (damageDefs) {
        damageTypeDefinition = damageDefs[itemDefinition.defaultDamageTypeHash];
      }
    }

    // Get the item instance from the inventory store
    const inventoryData = $inventoryStore;
    if (inventoryData && inventoryData.itemComponents.instances.data[item.itemInstanceId]) {
      itemInstance = inventoryData.itemComponents.instances.data[item.itemInstanceId];
    }
  });

  $: powerLevel = itemInstance?.primaryStat?.value ?? 'N/A';
  $: iconPath = overrideItemDefinition?.displayProperties.icon || itemDefinition?.displayProperties.icon;
</script>

{#if itemDefinition}
  <div class="flex items-center rounded-md bg-secondary p-2">
    <img
      src={`${BUNGIE_BASE_URL}${iconPath}`}
      alt={itemDefinition.displayProperties.name}
      class="mr-2 h-12 w-12"
    />
    <div class="flex-grow">
      <p class="text-sm font-semibold">{itemDefinition.displayProperties.name}</p>
      <p class="text-xs text-muted-foreground">Power: {powerLevel}</p>
    </div>
    {#if damageTypeDefinition}
      <img
        src={`${BUNGIE_BASE_URL}${damageTypeDefinition.displayProperties.icon}`}
        alt={damageTypeDefinition.displayProperties.name}
        class="h-6 w-6"
      />
    {/if}
  </div>
{:else}
  <Skeleton class="h-12 w-full rounded-md" />
{/if}
