<script lang="ts">
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "$lib/components/ui/toggle-group";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import { manifestStore } from "$lib/stores/manifest";

  export let characterId: string;
  export let onSelect: (subclassHash: string) => void;
  export let defaultSubclass: string | null = null;
  export let selectedSubclass: string | null = null;
  export let subclasses: Record<number, string>;

  $: if (defaultSubclass && !selectedSubclass) {
    selectedSubclass = defaultSubclass;
    console.log("Setting default subclass:", defaultSubclass);
  }

  function handleSubclassSelect(value: string) {
    selectedSubclass = value;
    onSelect(value);
  }

  $: console.log("Current selectedSubclass:", selectedSubclass);
</script>

<ToggleGroup
  type="single"
  value={selectedSubclass}
  onValueChange={handleSubclassSelect}
  class="flex flex-col justify-center space-y-4"
>
  {#each Object.entries(subclasses) as [hash, name] (hash)}
    <ToggleGroupItem value={hash}>
      {#if $manifestStore.tables.DestinyInventoryItemDefinition}
        {@const subclassDef = $manifestStore.tables.DestinyInventoryItemDefinition[hash]}
        {#if subclassDef}
          <img
            src={`${BUNGIE_BASE_URL}${subclassDef.displayProperties.icon}`}
            alt={name}
            class="w-10 h-10"
          />
          <span class="sr-only">{name}</span>
        {/if}
      {/if}
    </ToggleGroupItem>
  {/each}
</ToggleGroup>
