<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { Badge } from "$lib/components/ui/badge";
  import { manifestStore } from "$lib/stores/manifest";
  import type { DestinyStatDefinition } from "$lib/utils/types";

  // Input prop to handle priority changes
  export let onPrioritiesChange: (priorities: string[]) => void;

  // Initialize stat definitions
  let statDefinitions: Record<string, DestinyStatDefinition> = {};

  const flipDurationMs = 300;

  interface StatItem {
      id: string;
      hash: string;
  }

  // Initialize items array with default priorities
  let items: StatItem[] = [
      { id: "1", hash: "2996146975" }, // Mobility
      { id: "2", hash: "392767087" },  // Resilience
      { id: "3", hash: "1943323491" }, // Recovery
      { id: "4", hash: "1735777505" }, // Discipline
      { id: "5", hash: "144602215" },  // Intellect
      { id: "6", hash: "4244567218" }, // Strength
  ];

  // Pass default priorities to parent on component initialization
  $: {
    onPrioritiesChange(items.map(item => item.hash));
  }

  // Fetch the stat definitions from the manifest
  $: {
      manifestStore
          .getTable<DestinyStatDefinition>("DestinyStatDefinition")
          .then((defs) => {
              statDefinitions = defs || {};
          });
  }

  const handleConsider = (event: CustomEvent<DndEvent<StatItem>>) => {
      items = event.detail.items;
  }

  const handleFinalize = (event: CustomEvent<DndEvent<StatItem>>) => {
      items = event.detail.items;
      onPrioritiesChange(items.map(item => item.hash));
  }
</script>

<div>
  <section
    use:dndzone="{{ items, flipDurationMs }}"
    on:consider={handleConsider}
    on:finalize={handleFinalize}
    class="flex flex-col space-y-2"
  >
    {#each items as item (item.id)}
      <div class="flex items-center space-x-2 p-2 bg-secondary rounded-md cursor-move" animate:flip="{{ duration: flipDurationMs }}">
        {#if statDefinitions[item.hash]}
          <img 
            src={`https://www.bungie.net${statDefinitions[item.hash].displayProperties.icon}`} 
            alt={statDefinitions[item.hash].displayProperties.name} 
            class="w-6 h-6"
          />
          <Badge class="text-xs">{statDefinitions[item.hash].displayProperties.name}</Badge>
        {/if}
      </div>
    {/each}
  </section>
</div>