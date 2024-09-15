import { toast } from "svelte-sonner";
import type {
  DestinyLoadoutActionRequest,
  DestinyLoadoutUpdateActionRequest,
} from "$lib/utils/types";

export async function equipLoadout(
  loadoutIndex: number,
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyLoadoutActionRequest = {
      loadoutIndex,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/bungie/loadout-actions/equip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to equip loadout");
    }

    toast.success("Loadout equipped successfully");
  } catch (error) {
    console.error("Error equipping loadout:", error);
    toast.error("Failed to equip loadout");
  }
}

export async function clearLoadout(
  loadoutIndex: number,
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyLoadoutActionRequest = {
      loadoutIndex,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/bungie/loadout-actions/clear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to clear loadout");
    }

    toast.success("Loadout cleared successfully");
  } catch (error) {
    console.error("Error clearing loadout:", error);
    toast.error("Failed to clear loadout");
  }
}

export async function snapshotLoadout(
  loadoutIndex: number,
  characterId: string,
  membershipType: number,
  colorHash?: number,
  iconHash?: number,
  nameHash?: number,
) {
  try {
    const request: DestinyLoadoutUpdateActionRequest = {
      loadoutIndex,
      characterId,
      membershipType,
      colorHash,
      iconHash,
      nameHash,
    };

    const response = await fetch("/api/bungie/loadout-actions/snapshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to snapshot loadout");
    }

    toast.success("Loadout snapshotted successfully");
  } catch (error) {
    console.error("Error snapshotting loadout:", error);
    toast.error("Failed to snapshot loadout");
  }
}

export async function updateLoadoutIdentifiers(
  loadoutIndex: number,
  characterId: string,
  membershipType: number,
  colorHash?: number,
  iconHash?: number,
  nameHash?: number,
) {
  try {
    const request: DestinyLoadoutUpdateActionRequest = {
      loadoutIndex,
      characterId,
      membershipType,
      colorHash,
      iconHash,
      nameHash,
    };

    const response = await fetch("/api/bungie/loadout-actions/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to update loadout identifiers");
    }

    toast.success("Loadout identifiers updated successfully");
  } catch (error) {
    console.error("Error updating loadout identifiers:", error);
    toast.error("Failed to update loadout identifiers");
  }
}
