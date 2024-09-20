<script lang="ts">
  import Item from "$lib/components/Item.svelte";
  import type { InventoryItem } from "$lib/utils/types";

  export let loadout: InventoryItem[];

  console.log("Loadout:", loadout);
</script>

<div class="space-y-4">
  <h3 class="text-lg font-semibold">Optimized Loadout</h3>
  <div class="grid grid-cols-5 gap-4">
    {#each loadout as item, index (item.itemInstanceId || `${item.itemHash}-${index}`)}
      <Item {item} />
    {/each}
    }
  </div>
</div>
