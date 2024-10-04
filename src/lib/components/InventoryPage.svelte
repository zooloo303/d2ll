<script lang="ts">
  import { onMount } from "svelte";
  import { inventoryStore } from "$lib/stores/inventory";
  import { manifestStore } from "$lib/stores/manifest";
  import ItemList from "./ItemList.svelte";
  import { getInventoryItemInstances } from "$lib/utils/helpers";
  import type { InventoryItemWithComponents } from "$lib/utils/types";

  let items: InventoryItemWithComponents[] = [];

  onMount(() => {
    console.log("inventoryStore available:", $inventoryStore);
    console.log("manifestStore available:", $manifestStore);
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Inventory</h1>
  <!-- <ItemList {items} /> -->
</div>
