<script lang="ts">
  import { manifestStore } from "$lib/stores/manifest";
  import Item from "./Item.svelte";
  import type { InventoryItemWithComponents } from "$lib/utils/types";

  export let items: InventoryItemWithComponents[] = [];

  $: {
    console.log("Items received in ItemList:", items);
  }

  $: itemDefs = $manifestStore.tables.DestinyInventoryItemDefinition;

  $: weaponsAndArmor = items.filter((item) => {
    const itemDef = itemDefs[item.itemHash];
    return itemDef && (itemDef.itemType === 3 || itemDef.itemType === 2); // 3 for weapons, 2 for armor
  });

  $: {
    console.log("Filtered weaponsAndArmor:", weaponsAndArmor);
  }

  $: weapons = weaponsAndArmor.filter((item) => itemDefs[item.itemHash].itemType === 3);
  $: armor = weaponsAndArmor.filter((item) => itemDefs[item.itemHash].itemType === 2);

  $: {
    console.log("Weapons:", weapons);
    console.log("Armor:", armor);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <h2 class="text-xl font-semibold mb-2">Weapons ({weapons.length})</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {#each weapons as item (item.itemInstanceId)}
        <Item {item} />
      {/each}
    </div>
  </div>
  <div>
    <h2 class="text-xl font-semibold mb-2">Armor ({armor.length})</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {#each armor as item (item.itemInstanceId)}
        <Item {item} />
      {/each}
    </div>
  </div>
</div>
