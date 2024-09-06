import { writable } from "svelte/store";
import type { CompleteInventoryResponse } from "$lib/utils/types";
import { getInventory } from "$lib/services/api";

function createInventoryStore() {
  const { subscribe, set } = writable<CompleteInventoryResponse | null>(null);

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
        set(inventoryData);
        localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
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
