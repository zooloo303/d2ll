import { BUNGIE_API_ROOT } from "$lib/utils/constants";
import type { DestinyLoadoutActionRequest } from "$lib/utils/types";
import { toast } from "svelte-sonner";

export async function equipLoadout(loadoutIndex: number, characterId: string, membershipType: number) {
  try {
    const request: DestinyLoadoutActionRequest = {
      loadoutIndex,
      characterId,
      membershipType
    };

    const response = await fetch('/api/bungie/loadout-actions/equip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to equip loadout');
    }

    toast.success('Loadout equipped successfully');
  } catch (error) {
    console.error('Error equipping loadout:', error);
    toast.error('Failed to equip loadout');
  }
}
