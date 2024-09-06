import { writable } from "svelte/store";
import type { CompleteInventoryResponse } from "$lib/utils/types";
import { getInventory } from "$lib/services/api";

interface InventoryStore extends CompleteInventoryResponse {
  lastUpdated: number;
}

function createInventoryStore() {
  const { subscribe, set, update } = writable<InventoryStore | null>(null);

  return {
    subscribe,
    loadInventoryData: async (
      membershipType: number,
      destinyMembershipId: string,
    ) => {
      try {
        const inventoryData = await getInventory(
          membershipType,
          destinyMembershipId,
        );
        update(() => ({
          ...inventoryData,
          lastUpdated: Date.now(),
        }));
        localStorage.setItem(
          "inventoryData",
          JSON.stringify({
            ...inventoryData,
            lastUpdated: Date.now(),
          }),
        );
      } catch (error) {
        console.error("Error loading inventory data:", error);
      }
    },
    init: () => {
      const storedData = localStorage.getItem("inventoryData");
      if (storedData) {
        set(JSON.parse(storedData));
      }
    },
  };
}

export const inventoryStore = createInventoryStore();
