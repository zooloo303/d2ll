import { toast } from "svelte-sonner";
import type {
  DestinyItemActionRequest,
  DestinyItemTransferRequest,
  DestinyItemSetActionRequest,
} from "$lib/utils/types";

export async function equipItem(
  itemId: string,
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyItemActionRequest = {
      itemId,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/bungie/item-actions/equip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to equip item");
    }

    toast.success("Item equip successfully");
  } catch (error) {
    console.error("Error equipping item:", error);
    toast.error("Failed to equip item");
  }
}

export async function transferItem(
  itemReferenceHash: number,
  stackSize: number,
  transferToVault: boolean,
  itemId: string,
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyItemTransferRequest = {
      itemReferenceHash,
      stackSize,
      transferToVault,
      itemId,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/bungie/item-actions/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to transfer item");
    }

    toast.success("Item transfered successfully");
  } catch (error) {
    console.error("Error transfering item:", error);
    toast.error("Failed to transfer item");
  }
}

export async function equipItems(
  itemIds: string[],
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyItemSetActionRequest = {
      itemIds,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/bungie/item-actions/equip-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to equip items");
    }

    toast.success("Item equip successfully");
  } catch (error) {
    console.error("Error equipping items:", error);
    toast.error("Failed to equip items");
  }
}
