import { inventoryStore } from "$lib/stores/inventory";
import type {
  Loadout,
  InventoryItem,
  CompleteInventoryResponse,
  DestinyInventoryItemDefinition,
  } from "$lib/utils/types";

export function lazyLoad(image: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        observer.unobserve(img);
      }
    });
  });

  observer.observe(image);

  return {
    destroy() {
      observer.unobserve(image);
    },
  };
}

export function findItemInInventory(
  inventoryData: CompleteInventoryResponse | null,
  itemInstanceId: string,
): { item: InventoryItem; location: string } | undefined {
  if (!inventoryData) return undefined;

  // Check profile inventory (vault)
  const vaultItem = inventoryData.profileInventory.items.find(
    (i) => i.itemInstanceId === itemInstanceId,
  );
  if (vaultItem) {
    return { item: vaultItem, location: "vault" };
  }

  // Check character inventories and equipment
  for (const [characterId, inventory] of Object.entries(
    inventoryData.characterInventories,
  )) {
    const inventoryItem = inventory.items.find(
      (i) => i.itemInstanceId === itemInstanceId,
    );
    if (inventoryItem) {
      return { item: inventoryItem, location: characterId };
    }
  }

  for (const [characterId, equipment] of Object.entries(
    inventoryData.characterEquipment,
  )) {
    const equipmentItem = equipment.items.find(
      (i) => i.itemInstanceId === itemInstanceId,
    );
    if (equipmentItem) {
      return { item: equipmentItem, location: characterId };
    }
  }

  return undefined;
}

export function groupItemsBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}
