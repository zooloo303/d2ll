<script lang="ts">
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "$lib/components/ui/hover-card";
  import ItemActions from "./ItemActions.svelte";
  import { Progress } from "$lib/components/ui/progress";
  import { getManifestTable } from "$lib/services/manifest";
  import type {
    ItemInstance,
    ItemSocket,
    ItemStats,
    DestinyStatDefinition,
    DestinyInventoryItemDefinition,
  } from "$lib/utils/types";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "$lib/components/ui/tooltip";
  import { onMount } from "svelte";

  export let itemDefinition: DestinyInventoryItemDefinition;
  export let itemInstance: ItemInstance | null = null;
  export let itemStats: ItemStats | null = null;
  export let overrideItemDefinition: DestinyInventoryItemDefinition | null =
    null;
  export let itemSockets: ItemSocket[] | null = null;
  export let itemInstanceId: string;

  let statDefinitions: Record<string, DestinyStatDefinition> | null = null;
  let socketDefinitions: Record<string, DestinyInventoryItemDefinition> | null =
    null;

  async function loadDefinitions() {
    [statDefinitions, socketDefinitions] = await Promise.all([
      getManifestTable<DestinyStatDefinition>("DestinyStatDefinition"),
      getManifestTable<DestinyInventoryItemDefinition>(
        "DestinyInventoryItemDefinition",
      ),
    ]);
  }

  onMount(loadDefinitions);

  $: combinedStats = itemStats
    ? Object.entries(itemStats).reduce((acc, [statHash, stat]) => {
        const definitionStat = itemDefinition.stats[statHash];
        acc[statHash] = {
          ...definitionStat,
          ...stat,
          value: stat.value,
          displayMaximum: stat.displayMaximum || 100,
        };
        return acc;
      }, {} as ItemStats)
    : itemDefinition.stats;

  $: displayedDefinition = overrideItemDefinition || itemDefinition;
  $: iconPath = displayedDefinition.displayProperties.icon;
  $: screenshotPath = displayedDefinition.screenshot;
  $: visibleSockets = itemSockets?.filter((socket) => socket.isVisible) ?? [];
</script>

<HoverCard>
  <HoverCardTrigger>
    <slot />
  </HoverCardTrigger>
  <HoverCardContent class="w-80">
    <div class="flex flex-col space-y-2">
      <h3 class="text-lg font-bold">{itemDefinition.displayProperties.name}</h3>
      <div class="flex flex-row items-center justify-between">
        <img
          src={`${BUNGIE_BASE_URL}${iconPath}`}
          alt={itemDefinition.displayProperties.name}
          class="h-16 w-16"
        />
        <ItemActions {itemInstanceId} {itemInstance} />
      </div>
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
      {#if visibleSockets.length > 0 && socketDefinitions}
        <div class="w-full mb-2">
          <h4 class="text-sm font-semibold mb-1">Sockets:</h4>
          <div class="flex flex-wrap gap-1">
            {#each visibleSockets as socket}
              {#if socketDefinitions[socket.plugHash]}
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      src={`${BUNGIE_BASE_URL}${socketDefinitions[socket.plugHash].displayProperties.icon}`}
                      alt={socketDefinitions[socket.plugHash].displayProperties
                        .name}
                      class="w-6 h-6"
                      class:opacity-50={!socket.isEnabled}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {socketDefinitions[socket.plugHash].displayProperties
                        .name}
                    </p>
                    <p>
                      {socketDefinitions[socket.plugHash].displayProperties
                        .description}
                    </p>
                    {#if !socket.isEnabled}
                      <p class="text-yellow-500">
                        This socket is currently disabled.
                      </p>
                    {/if}
                  </TooltipContent>
                </Tooltip>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
      {#if combinedStats && statDefinitions}
        <div class="w-full">
          <h4 class="text-sm font-semibold mb-2">Stats:</h4>
          {#each Object.entries(combinedStats) as [statHash, stat]}
            {#if statDefinitions[statHash]}
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-xs w-24"
                  >{statDefinitions[statHash].displayProperties.name}:</span
                >
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
