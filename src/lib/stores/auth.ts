import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { UserData } from '$lib/utils/types';

function createUserStore() {
  const { subscribe, set, update }: Writable<UserData> = writable({
    bungieNetUser: {
      membershipId: '',
      displayName: '',
      profilePicturePath: '',
    },
    destinyMemberships: [],
  });

  return {
    subscribe,
    clearUser: () => {
      localStorage.removeItem('userData');
      set({
        bungieNetUser: {
          membershipId: '',
          displayName: '',
          profilePicturePath: '',
        },
        destinyMemberships: [],
      });
    },
    init: async () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        set(userData);
        
        // Validate the token
        const isValid = await validateToken();
        if (!isValid) {
          userStore.clearUser();
        }
      }
    },
    save: (userData: UserData) => {
      localStorage.setItem('userData', JSON.stringify(userData));
      set(userData);
    }
  };
}

export const userStore = createUserStore();

async function validateToken() {
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'GET',
      credentials: 'include', // This is important to include cookies
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}