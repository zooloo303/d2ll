<script lang="ts">
import type { Loadout } from "$lib/utils/types";
import { Button } from "$lib/components/ui/button";
import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
import { stageLoadout, equipLoadout, snapshotLoadout, clearLoadout } from "$lib/services/loadoutActions";

  export let loadout: Loadout;
  export let characterId: string;

  async function handleStageLoadout() {
    await stageLoadout(loadout, characterId);
  }

  async function handleEquipLoadout() {
    await equipLoadout(loadout, characterId);
  }

  async function handleSnapshotLoadout() {
    await snapshotLoadout(characterId);
  }

  async function handleClearLoadout() {
    await clearLoadout(loadout, characterId);
  }
</script>
<div class="p-4">
<Card>
    <CardHeader><h3 class="text-lg font-semibold">Actions</h3></CardHeader>
    <CardContent>
<div class="flex flex-row items-center justify-center space-x-2">
    <Button variant="ghost" on:click={handleStageLoadout}>Stage Loadout</Button>
    <Button variant="ghost" on:click={handleEquipLoadout}>Equip Loadout</Button>
    <Button variant="ghost" on:click={handleSnapshotLoadout}>Snapshot Loadout</Button>
    <Button variant="ghost" on:click={handleClearLoadout}>Clear Loadout</Button>
</div>
</CardContent>
</Card>
</div>