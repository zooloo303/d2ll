import { writable } from "svelte/store";
import type { Character, CharacterLoadouts } from "$lib/utils/types";
import { getCharacterData } from "$lib/services/api";

interface CharacterStore {
  characters: { [characterId: string]: Character };
  loadouts: CharacterLoadouts;
  lastUpdated: number;
}

function createCharacterStore() {
  const { subscribe, set, update } = writable<CharacterStore>({
    characters: {},
    loadouts: {},
    lastUpdated: 0,
  });

  return {
    subscribe,
    loadCharacterData: async (
      membershipType: number,
      destinyMembershipId: string,
    ) => {
      try {
        const { characters, loadouts } = await getCharacterData(
          membershipType,
          destinyMembershipId,
        );
        update(() => ({
          characters,
          loadouts,
          lastUpdated: Date.now(),
        }));
        localStorage.setItem(
          "characterData",
          JSON.stringify({ characters, loadouts, lastUpdated: Date.now() }),
        );
      } catch (error) {
        console.error("Error loading character data:", error);
      }
    },
    init: () => {
      const storedData = localStorage.getItem("characterData");
      if (storedData) {
        set(JSON.parse(storedData));
      }
    },
  };
}

export const characterStore = createCharacterStore();
