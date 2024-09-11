import type {
  DestinyLoadoutActionRequest,
  LoadoutActionResponse,
} from "$lib/utils/types";
import { userStore } from "$lib/stores/auth";

async function makeLoadoutRequest(action: string, loadout: Loadout, characterId: string) {
  const { destinyMemberships } = userStore.get();
  if (!destinyMemberships.length) {
    throw new Error("User not authenticated");
  }

  const membershipType = destinyMemberships[0].membershipType;
  const membershipId = destinyMemberships[0].membershipId;

  const response = await fetch("/api/bungie/loadout-actions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      loadoutIndex: loadout.loadoutIndex,
      characterId,
      membershipType,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} loadout`);
  }

  return response.json();
}

export async function stageLoadout(loadout: Loadout, characterId: string) {
  return makeLoadoutRequest("stageLoadout", loadout, characterId);
}

export async function equipLoadout(loadout: Loadout, characterId: string) {
  return makeLoadoutRequest("equipLoadout", loadout, characterId);
}

export async function snapshotLoadout(characterId: string) {
  return makeLoadoutRequest("snapshotLoadout", {} as Loadout, characterId);
}

export async function clearLoadout(loadout: Loadout, characterId: string) {
  return makeLoadoutRequest("clearLoadout", loadout, characterId);
}
