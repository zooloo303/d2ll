<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    equipLoadout,
    snapshotLoadout,
    clearLoadout,
  } from "$lib/services/loadoutActions";
  import type { Character, Loadout } from "$lib/utils/types";
  import { Card, CardHeader, CardContent } from "$lib/components/ui/card";
  import LoadoutIdentifierDrawer from "./LoadoutIdentifierDrawer.svelte";
  import { Axe, Camera, IdCard, CircleX } from "lucide-svelte";

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
  <CardHeader><h3 class="text-lg font-semibold">Actions</h3></CardHeader>
  <CardContent>
    <Button variant="ghost" on:click={handleEquipLoadout}><Axe class="mr-2 h-4 w-4" /> Equip</Button>
    <Button variant="ghost" on:click={handleSnapshotLoadout}><Camera class="mr-2 h-4 w-4" /> Overwrite</Button>
    <Button variant="ghost" on:click={() => (identifierDrawerOpen = true)}><IdCard class="mr-2 h-4 w-4" /> Update Identifiers</Button>
    <Button variant="ghost" on:click={handleEClearLoadout}><CircleX class="mr-2 h-4 w-4 text-red-500" /> Clear</Button>
    <!-- Add other action buttons here -->
  </CardContent>
  <LoadoutIdentifierDrawer
    bind:open={identifierDrawerOpen}
    {loadout}
    {loadoutIndex}
    {character}
  />
</Card>
