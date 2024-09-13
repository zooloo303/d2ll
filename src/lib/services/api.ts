import { userStore } from "$lib/stores/auth";
import type {
  Character,
  CharacterLoadouts,
  CompleteInventoryResponse,
} from "$lib/utils/types";

async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  retryCount = 0,
) {
  console.log("Attempting authenticated fetch:", url);
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401 && retryCount < 3) {
    console.log("Received 401, attempting to refresh token");
    const refreshed = await userStore.refreshToken();
    if (refreshed) {
      console.log("Token refreshed successfully, retrying original request");
      return authenticatedFetch(url, options, retryCount + 1);
    } else {
      console.log("Token refresh failed");
      throw new Error("Authentication failed");
    }
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
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
