import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Character, CharacterLoadouts } from '$lib/utils/types';

interface CharacterStore {
  characters: Character[];
  loadouts: CharacterLoadouts;
}

function createCharacterStore() {
  const { subscribe, set, update }: Writable<CharacterStore> = writable({
    characters: [],
    loadouts: {}
  });

  return {
    subscribe,
    setCharacters: (characters: Character[]) => update(store => ({ ...store, characters })),
    setLoadouts: (loadouts: CharacterLoadouts) => update(store => ({ ...store, loadouts })),
    clearCharacters: () => set({ characters: [], loadouts: {} }),
    init: () => {
      const storedData = localStorage.getItem('characterData');
      if (storedData) {
        const parsedData = JSON.parse(storedData) as CharacterStore;
        set(parsedData);
      }
    },
    save: (data: CharacterStore) => {
      localStorage.setItem('characterData', JSON.stringify(data));
      set(data);
    }
  };
}

export const characterStore = createCharacterStore();
