<script lang="ts">
  import { onMount } from "svelte";
  import { createSwapy } from "swapy";
  import { Badge } from "$lib/components/ui/badge";
  import { manifestStore } from "$lib/stores/manifest";
  import type { DestinyStatDefinition } from "$lib/utils/types";

  export let onPrioritiesChange: (priorities: string[]) => void;

  let statDefinitions: Record<string, DestinyStatDefinition> = {};
  let statOrder = [
    "2996146975", // Mobility
    "392767087", // Resilience
    "1943323491", // Recovery
    "1735777505", // Discipline
    "144602215", // Intellect
    "4244567218", // Strength
  ];

  let container: HTMLElement;

  $: {
    manifestStore
      .getTable<DestinyStatDefinition>("DestinyStatDefinition")
      .then((defs) => {
        statDefinitions = defs || {};
      });
  }

  onMount(() => {
    const swapy = createSwapy(container, {
      animation: "dynamic",
    });

    swapy.onSwap((event) => {
      const newOrder = event.data.array.map((item) => item.item);
      statOrder = newOrder;
      onPrioritiesChange(newOrder);
    });

    return () => {
      swapy.destroy();
    };
  });
</script>

<div bind:this={container} class="flex flex-col space-y-2">
  {#each statOrder as statHash, index}
    {#if statDefinitions[statHash]}
      <div
        class="flex items-center space-x-2 p-2 bg-secondary rounded-md cursor-move"
        data-swapy-slot={`stat-${index}`}
        data-swapy-item={statHash}
      >
        <img
          src={`https://www.bungie.net${statDefinitions[statHash].displayProperties.icon}`}
          alt={statDefinitions[statHash].displayProperties.name}
          class="w-6 h-6"
        />
        <Badge>{statDefinitions[statHash].displayProperties.name}</Badge>
      </div>
    {/if}
  {/each}
</div>

<style>
  [data-swapy-highlighted] {
    outline: 2px solid var(--primary);
  }
</style>
