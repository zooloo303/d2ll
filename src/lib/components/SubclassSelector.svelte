<script lang="ts">
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "$lib/components/ui/toggle-group";
  import { inventoryStore } from "$lib/stores/inventory";
  import { manifestStore } from "$lib/stores/manifest";
  import type { DestinyInventoryItemDefinition } from "$lib/utils/types";

  export let characterId: string;
  export let onSelect: (subclassHash: string) => void;

  let subclasses: DestinyInventoryItemDefinition[] = [];
  let selectedSubclass: string | null = null;

  $: {
    const inventory = $inventoryStore;
    if (inventory && inventory.characterInventories[characterId]) {
      const subclassItems = inventory.characterInventories[
        characterId
      ].items.filter((item) => item.bucketHash === 3284755031);
      manifestStore
        .getTable<DestinyInventoryItemDefinition>(
          "DestinyInventoryItemDefinition",
        )
        .then((defs) => {
          if (defs) {
            subclasses = subclassItems
              .map((item) => defs[item.itemHash])
              .filter(Boolean);
          }
        });
    }
  }

  function handleSubclassSelect(value: string) {
    selectedSubclass = value;
    onSelect(value);
  }
</script>

<ToggleGroup
  type="single"
  value={selectedSubclass}
  onValueChange={handleSubclassSelect}
  class="flex flex-col justify-center space-y-4"
>
  {#each subclasses as subclass (subclass.hash)}
    <ToggleGroupItem value={subclass.hash.toString()}>
      <img
        src={`https://www.bungie.net${subclass.displayProperties.icon}`}
        alt={subclass.displayProperties.name}
        class="w-10 h-10"
      />
      <span class="sr-only">{subclass.displayProperties.name}</span>
    </ToggleGroupItem>
  {/each}
</ToggleGroup>
