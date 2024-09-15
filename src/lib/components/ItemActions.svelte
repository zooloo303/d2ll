<script lang="ts">
  import { Avatar, AvatarImage } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { equipItem, transferItem } from "$lib/services/itemActions";
  import { characterStore } from "$lib/stores/characters";
  import { inventoryStore } from "$lib/stores/inventory";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import { findItemInInventory } from "$lib/utils/helpers";
  import type {
    Character,
    InventoryItem,
    ItemInstance,
  } from "$lib/utils/types";

  export let itemInstanceId: string;
  export let itemInstance: ItemInstance;

  $: characters = Object.values($characterStore.characters);
  $: currentItemLocation = findItemInInventory($inventoryStore, itemInstanceId);
  $: isInVault = currentItemLocation?.location === "vault";

  function canEquip(character: Character): boolean {
    if (!currentItemLocation) return false;
    return (
      currentItemLocation.location === character.characterId &&
      !itemInstance.isEquipped
    );
  }

  function canTransfer(character: Character): boolean {
    if (!currentItemLocation) return false;
    if (isInVault) return true;
    if (itemInstance.isEquipped) return false;
    return currentItemLocation.location !== character.characterId;
  }

  async function handleEquip(character: Character) {
    if (canEquip(character)) {
      await equipItem(
        itemInstanceId,
        character.characterId,
        character.membershipType,
      );
    }
  }

  async function handleTransfer(character: Character) {
    if (!currentItemLocation) return;
    const item = currentItemLocation.item as InventoryItem;

    if (itemInstance.isEquipped) {
      // If item is equipped, transfer to vault first
      await transferItem(
        item.itemHash,
        item.quantity,
        true,
        itemInstanceId,
        character.characterId,
        character.membershipType,
      );
    }

    if (isInVault || canTransfer(character)) {
      await transferItem(
        item.itemHash,
        item.quantity,
        isInVault ? false : true,
        itemInstanceId,
        character.characterId,
        character.membershipType,
      );
    }
  }
</script>

<div class="space-y-4">
  <div>
    <h3 class="mb-2 text-sm font-semibold">Equip Item on:</h3>
    <div class="flex space-x-2">
      {#each characters as character}
        <Button
          variant="ghost"
          size="icon"
          disabled={!canEquip(character)}
          on:click={() => handleEquip(character)}
        >
          <Avatar>
            <AvatarImage
              src={`${BUNGIE_BASE_URL}${character.emblemPath}`}
              alt={`Equip on ${character.classType}`}
            />
          </Avatar>
        </Button>
      {/each}
    </div>
  </div>

  <div>
    <h3 class="mb-2 text-sm font-semibold">Transfer Item to:</h3>
    <div class="flex space-x-2">
      {#each characters as character}
        <Button
          variant="ghost"
          size="icon"
          disabled={!canTransfer(character)}
          on:click={() => handleTransfer(character)}
        >
          <Avatar>
            <AvatarImage
              src={`${BUNGIE_BASE_URL}${character.emblemPath}`}
              alt={`Transfer to ${character.classType}`}
            />
          </Avatar>
        </Button>
      {/each}
    </div>
  </div>
</div>
