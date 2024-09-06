import { writable } from "svelte/store";
import type { Character, CharacterLoadouts } from "$lib/utils/types";
import { getCharacterData } from "$lib/services/api";

interface CharacterStore {
  characters: { [characterId: string]: Character };
  loadouts: CharacterLoadouts;
}

function createCharacterStore() {
  const { subscribe, set } = writable<CharacterStore>({
    characters: {},
    loadouts: {},
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
        set({ characters, loadouts });
        localStorage.setItem(
          "characterData",
          JSON.stringify({ characters, loadouts }),
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
