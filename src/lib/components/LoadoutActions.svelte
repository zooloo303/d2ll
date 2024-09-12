<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { equipLoadout, snapshotLoadout, clearLoadout } from "$lib/services/loadoutActions";
  import type { Character, Loadout } from "$lib/utils/types";
  import { Card, CardHeader, CardContent } from "$lib/components/ui/card";
  import LoadoutIdentifierDrawer from "./LoadoutIdentifierDrawer.svelte";

  export let loadout: Loadout;
  export let loadoutIndex: number;
  export let character: Character;

  const { colorHash, iconHash, nameHash } = loadout;

  let identifierDrawerOpen = false;

  async function handleEquipLoadout() {
    await equipLoadout(
      loadoutIndex,
      character.characterId,
      character.membershipType,
    );
  }

  async function handleEClearLoadout() {
    await clearLoadout(
      loadoutIndex,
      character.characterId,
      character.membershipType,
    );
  }

  async function handleSnapshotLoadout() {
    await snapshotLoadout(
      loadoutIndex,
      character.characterId,
      character.membershipType,
      colorHash,
      iconHash,
      nameHash,
    );
  }
</script>

<Card>
  <CardHeader><h3 class="mb-2 text-lg font-semibold">Actions</h3></CardHeader>
  <CardContent>
    <Button variant="ghost" on:click={handleEquipLoadout}>Equip Loadout</Button>
    <Button variant="ghost" on:click={handleSnapshotLoadout}
      >Snapshot Loadout</Button
    >
    <Button variant="ghost" on:click={handleEClearLoadout}>Clear Loadout</Button>
    <Button variant="ghost" on:click={() => identifierDrawerOpen = true}>Update Identifiers</Button>
    <!-- Add other action buttons here -->
  </CardContent>
  <LoadoutIdentifierDrawer 
    bind:open={identifierDrawerOpen} 
    {loadout} 
    {loadoutIndex} 
    {character} 
  />
</Card>
