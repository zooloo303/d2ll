<script lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "$lib/components/ui/accordion";
  import Item from "$lib/components/Item.svelte";
  import type { InventoryItem, DestinyInventoryItemDefinition } from "$lib/utils/types";
  import { getManifestTable } from "$lib/services/manifest";
  import { onMount } from "svelte";

  export let items: InventoryItem[] = [];
  export let onSelect: (itemInstanceId: string) => void;

  let selectedExotic: string | null = null;
  let itemDefinitions: Record<string, DestinyInventoryItemDefinition> = {};

  const armorTypes = ["Helmet", "Gauntlets", "Chest Armor", "Leg Armor"];

  onMount(async () => {
    itemDefinitions = await getManifestTable<DestinyInventoryItemDefinition>("DestinyInventoryItemDefinition");
    console.log("ExoticArmorSelector: Received items:", items);
  });

  function handleExoticSelect(itemInstanceId: string) {
    console.log("ExoticArmorSelector: Item selected:", itemInstanceId);
    selectedExotic = itemInstanceId;
    onSelect(itemInstanceId);
  }

  $: groupedItems = armorTypes.reduce((acc, armorType) => {
    acc[armorType] = items.filter(item => 
      itemDefinitions[item.itemHash]?.itemTypeDisplayName === armorType
    );
    return acc;
  }, {} as Record<string, InventoryItem[]>);
</script>

<Accordion type="single" collapsible>
  {#each armorTypes as armorType}
    <AccordionItem value={armorType}>
      <AccordionTrigger>{armorType}</AccordionTrigger>
      <AccordionContent>
        <div class="grid grid-cols-4 gap-2">
          {#each groupedItems[armorType] || [] as item (item.itemInstanceId)}
            <Item
              {item}
              isSelected={selectedExotic === item.itemInstanceId}
              onClick={() => handleExoticSelect(item.itemInstanceId)}
            />
          {/each}
        </div>
      </AccordionContent>
    </AccordionItem>
  {/each}
</Accordion>
