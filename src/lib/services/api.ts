import type {
  Character,
  CharacterLoadouts,
  CompleteInventoryResponse,
} from "$lib/utils/types";

export async function getCharacterData(
  membershipType: number,
  destinyMembershipId: string,
) {
  const url = `/api/bungie/character-data?membershipType=${membershipType}&destinyMembershipId=${destinyMembershipId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch character data");
  }

  const data = await response.json();

  return data as {
    characters: { [characterId: string]: Character };
    loadouts: CharacterLoadouts;
  };
}

export async function getInventory(
  membershipType: number,
  destinyMembershipId: string,
) {
  const url = `/api/bungie/inventory-data?membershipType=${membershipType}&destinyMembershipId=${destinyMembershipId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch inventory data");
  }

  const data = await response.json();

  return data as CompleteInventoryResponse;
}
