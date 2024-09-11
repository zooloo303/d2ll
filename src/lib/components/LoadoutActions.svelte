<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { equipLoadout } from "$lib/services/loadoutActions";
  import type { Character, Loadout } from "$lib/utils/types";
  import { Card, CardHeader, CardContent } from "$lib/components/ui/card";

  export let loadout: Loadout;
  export let loadoutIndex: number;
  export let character: Character;

  async function handleEquipLoadout() {
    await equipLoadout(loadoutIndex, character.characterId, character.membershipType);
  }
</script>

<Card>
    <CardHeader><h3 class="mb-2 text-lg font-semibold">Actions</h3></CardHeader>
    <CardContent>
  <Button variant="ghost" on:click={handleEquipLoadout}>Equip Loadout</Button>
  <!-- Add other action buttons here -->
</CardContent>
</Card>