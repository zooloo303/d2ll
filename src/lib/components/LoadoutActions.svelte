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
    <Button variant="ghost" on:click={handleEquipLoadout}>Equip <Axe /></Button>
    <Button variant="ghost" on:click={handleSnapshotLoadout}
      >Overwrite <Camera /></Button
    >
    <Button variant="ghost" on:click={() => (identifierDrawerOpen = true)}
      >Update Identifiers <IdCard /></Button
    >
    <Button variant="ghost" on:click={handleEClearLoadout}
      >Clear <CircleX /></Button
    >
    <!-- Add other action buttons here -->
  </CardContent>
  <LoadoutIdentifierDrawer
    bind:open={identifierDrawerOpen}
    {loadout}
    {loadoutIndex}
    {character}
  />
</Card>
