import { userStore } from '$lib/stores/auth';
import type { Character, CharacterLoadouts, CompleteInventoryResponse } from "$lib/utils/types";

async function authenticatedFetch(url: string, options: RequestInit = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (response.status === 401) {
    // Token might be expired, try to refresh
    const refreshed = await userStore.refreshToken();
    if (refreshed) {
      // Retry the original request with the new token
      response = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    }
  }

  return response;
}

export async function getCharacterData(
  membershipType: number,
  destinyMembershipId: string,
) {
  const url = `/api/bungie/character-data?membershipType=${membershipType}&destinyMembershipId=${destinyMembershipId}`;

  const response = await authenticatedFetch(url);

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

  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch inventory data");
  }

  const data = await response.json();

  return data as CompleteInventoryResponse;
}

// Add any other API functions here
