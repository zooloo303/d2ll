<script lang="ts">
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "$lib/components/ui/hover-card";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import type {
    ItemDefinition,
    ItemInstance,
    ItemStat,
  } from "$lib/utils/types";

  export let itemDefinition: ItemDefinition;
  export let itemInstance: ItemInstance | null = null;
  export let itemStats: ItemStat | null = null;
  export let plugItemHashes: number[] | null = null;

  $: powerLevel = itemInstance?.primaryStat?.value ?? "N/A";
</script>

<HoverCard>
  <HoverCardTrigger>
    <slot />
  </HoverCardTrigger>
  <HoverCardContent>
    <div class="flex flex-col space-y-2">
      <h3 class="text-lg font-bold">{itemDefinition.displayProperties.name}</h3>
      <img
        src={`${BUNGIE_BASE_URL}${itemDefinition.displayProperties.icon}`}
        alt={itemDefinition.displayProperties.name}
        class="h-16 w-16"
      />
      <p class="text-sm">{itemDefinition.itemTypeDisplayName}</p>
      <p class="text-sm">{itemDefinition.displayProperties.description}</p>
      <p class="text-sm">Power: {powerLevel}</p>
      {#if itemDefinition.screenshot}
        <img
          src={`${BUNGIE_BASE_URL}${itemDefinition.screenshot}`}
          alt="Item screenshot"
          class="h-32 w-full object-cover"
        />
      {/if}
      {#if itemStats}
        <div>
          <h4 class="text-sm font-semibold">Stats:</h4>
          <ul class="text-xs">
            {#each Object.entries(itemStats) as [statHash, stat]}
              <li>{itemDefinition.stats[statHash]?.name}: {stat.value}</li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if plugItemHashes}
        <div>
          <h4 class="text-sm font-semibold">Plug Item Hashes:</h4>
          <ul class="text-xs">
            {#each plugItemHashes as hash}
              <li>{hash}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </HoverCardContent>
</HoverCard>
