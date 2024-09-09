<script lang="ts">
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "$lib/components/ui/hover-card";
  import { Progress } from "$lib/components/ui/progress";
  import { getManifestTable } from "$lib/services/manifest";
  import type {
    ItemDefinition,
    ItemInstance,
    ItemStats,
    StatDefinition,
  } from "$lib/utils/types";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";

  export let itemDefinition: ItemDefinition;
  export let itemInstance: ItemInstance | null = null;
  export let itemStats: ItemStats | null = null;
  export let overrideItemDefinition: ItemDefinition | null = null;

  let statDefinitions: Record<string, StatDefinition> | null = null;

  async function loadStatDefinitions() {
    statDefinitions = await getManifestTable<StatDefinition>("DestinyStatDefinition");
  }

  loadStatDefinitions();

  $: combinedStats = itemStats
    ? Object.entries(itemStats).reduce((acc, [statHash, stat]) => {
        const definitionStat = itemDefinition.stats[statHash];
        acc[statHash] = {
          ...definitionStat,
          ...stat,
          value: stat.value,
          displayMaximum: stat.displayMaximum || 100, // Use 100 as default if not set
        };
        return acc;
      }, {} as ItemStats)
    : itemDefinition.stats;

  $: displayedDefinition = overrideItemDefinition || itemDefinition;
  $: iconPath = displayedDefinition.displayProperties.icon;
  $: screenshotPath = displayedDefinition.screenshot;
</script>

<HoverCard>
  <HoverCardTrigger>
    <slot />
  </HoverCardTrigger>
  <HoverCardContent>
    <div class="flex flex-col space-y-2">
      <h3 class="text-lg font-bold">{itemDefinition.displayProperties.name}</h3>
      <img
        src={`${BUNGIE_BASE_URL}${iconPath}`}
        alt={itemDefinition.displayProperties.name}
        class="h-16 w-16"
      />
      <p class="text-sm">{itemDefinition.itemTypeDisplayName}</p>
      <p class="text-sm">{itemDefinition.displayProperties.description}</p>
      {#if itemInstance?.primaryStat}
        <p class="text-sm">Power: {itemInstance.primaryStat.value}</p>
      {/if}
      {#if screenshotPath}
        <img
          src={`${BUNGIE_BASE_URL}${screenshotPath}`}
          alt="Item screenshot"
          class="h-32 w-full object-cover"
        />
      {/if}
      {#if combinedStats && statDefinitions}
        <div class="w-full">
          <h4 class="text-sm font-semibold mb-2">Stats:</h4>
          {#each Object.entries(combinedStats) as [statHash, stat]}
            {#if statDefinitions[statHash]}
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-xs w-24">{statDefinitions[statHash].displayProperties.name}:</span>
                <Progress
                  value={stat.value}
                  max={stat.displayMaximum}
                  class="flex-grow h-2"
                />
                <span class="text-xs w-8 text-right">{stat.value}</span>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </HoverCardContent>
</HoverCard>
