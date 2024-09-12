<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { equipLoadout, snapshotLoadout } from "$lib/services/loadoutActions";
  import type { Character, Loadout } from "$lib/utils/types";
  import { Card, CardHeader, CardContent } from "$lib/components/ui/card";

  export let loadout: Loadout;
  export let loadoutIndex: number;
  export let character: Character;

  const { colorHash, iconHash, nameHash } = loadout;

  async function handleEquipLoadout() {
    await equipLoadout(
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
    <!-- Add other action buttons here -->
  </CardContent>
</Card>
