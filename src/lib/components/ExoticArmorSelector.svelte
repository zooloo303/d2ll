<script lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "$lib/components/ui/accordion";
  import Item from "$lib/components/Item.svelte";
  import type { InventoryItem } from "$lib/utils/types";

  export let items: InventoryItem[] = [];
  export let onSelect: (itemInstanceId: string) => void;

  let selectedExotic: string | null = null;

  const armorTypes = ["Helmet", "Gauntlets", "Chest Armor", "Leg Armor"];

  function handleExoticSelect(itemInstanceId: string) {
    selectedExotic = itemInstanceId;
    onSelect(itemInstanceId);
  }
</script>

<Accordion type="single" collapsible>
  {#each armorTypes as armorType}
    <AccordionItem value={armorType}>
      <AccordionTrigger>{armorType}</AccordionTrigger>
      <AccordionContent>
        <div class="grid grid-cols-4 gap-2">
          {#each items.filter((item) => item.itemTypeDisplayName === armorType) as item (item.itemInstanceId)}
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
