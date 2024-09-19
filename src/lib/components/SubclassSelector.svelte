<script lang="ts">
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "$lib/components/ui/toggle-group";
  import { inventoryStore } from "$lib/stores/inventory";
  import { manifestStore } from "$lib/stores/manifest";
  import type { DestinyInventoryItemDefinition, InventoryItem } from "$lib/utils/types";
  import { WARLOCK_SUBCLASSES, HUNTER_SUBCLASSES, TITAN_SUBCLASSES } from "$lib/utils/constants";

  export let characterId: string;
  export let onSelect: (subclassHash: string) => void;
  export let defaultSubclass: string | null = null;
  export let selectedSubclass: string | null = null;

  let subclasses: DestinyInventoryItemDefinition[] = [];

  $: {
    const inventory = $inventoryStore;
    const itemDefs = $manifestStore.tables.DestinyInventoryItemDefinition;
    if (inventory && inventory.characterInventories[characterId] && itemDefs) {
      const characterItems = inventory.characterInventories[characterId].items;
      console.log("Character Items:", characterItems);
      
      subclasses = characterItems
        .map((item: InventoryItem) => {
          const def = itemDefs[item.itemHash];
          console.log("Item Definition:", def);
          return def;
        })
        .filter((def: DestinyInventoryItemDefinition) => {
          const isSubclass = def && def.itemType === 16;
          console.log("Is Subclass:", isSubclass, def?.displayProperties?.name);
          return isSubclass;
        })
        .filter(Boolean);
      
      console.log("Filtered Subclasses:", subclasses);
    }
  }

  function handleSubclassSelect(value: string) {
    selectedSubclass = value;
    onSelect(value);
  }

  $: if (defaultSubclass && !selectedSubclass) {
    selectedSubclass = defaultSubclass;
    console.log("Setting default subclass:", defaultSubclass);
  }

  $: console.log("Current selectedSubclass:", selectedSubclass);
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
