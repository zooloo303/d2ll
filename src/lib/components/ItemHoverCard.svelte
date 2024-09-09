<script lang="ts">
    import { HoverCard, HoverCardContent, HoverCardTrigger } from "$lib/components/ui/hover-card";
    import { BUNGIE_BASE_URL } from "$lib/utils/constants";
    import type { ItemDefinition } from "$lib/utils/types";
  
    export let item: ItemDefinition;
    export let children: HTMLElement;
  
    $: filteredPlugs = item.sockets?.socketEntries
      .flatMap(entry => entry.reusablePlugItems)
      .filter(plug => plug.plugItemHash !== 2166136261)
      .map(plug => plug.plugItemHash) || [];
  </script>
  
  <HoverCard>
    <HoverCardTrigger asChild>
      <div>
        <slot />
      </div>
    </HoverCardTrigger>
    <HoverCardContent class="w-80">
      <div class="flex justify-between space-x-4">
        <div class="space-y-1">
          <img
            src={`${BUNGIE_BASE_URL}${item.displayProperties.icon}`}
            alt={item.displayProperties.name}
            class="h-12 w-12"
          />
          <h4 class="text-sm font-semibold">{item.displayProperties.name}</h4>
          <p class="text-sm text-muted-foreground">{item.itemTypeDisplayName}</p>
          {#if item.flavorText}
            <p class="text-sm italic">{item.flavorText}</p>
          {/if}
        </div>
      </div>
      {#if item.screenshot}
        <div class="mt-4">
          <img
            src={`${BUNGIE_BASE_URL}${item.screenshot}`}
            alt="Item Screenshot"
            class="rounded-md"
          />
        </div>
      {/if}
      {#if filteredPlugs.length > 0}
        <div class="mt-4">
          <h5 class="text-sm font-semibold">Plugs:</h5>
          <div class="flex flex-wrap gap-1 mt-1">
            {#each filteredPlugs as plugHash}
              <span class="text-xs bg-secondary text-secondary-foreground rounded px-1 py-0.5">
                {plugHash}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </HoverCardContent>
  </HoverCard>