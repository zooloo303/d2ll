import { writable, get } from 'svelte/store';
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

  let tokenValidationInterval: NodeJS.Timeout;

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
    },
    getUser: () => get({ subscribe }),
    refreshToken: async () => {
      console.log('Attempting to refresh token');
      const response = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (response.ok) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.log('Token refresh failed', await response.text());
        userStore.clearUser();
        return false;
      }
    },
    startTokenValidation: () => {
      // Check token validity every 5 minutes
      tokenValidationInterval = setInterval(async () => {
        console.log('Validating token');
        const isValid = await validateToken();
        if (!isValid) {
          console.log('Token invalid, attempting refresh');
          await userStore.refreshToken();
        }
      }, 5 * 60 * 1000);
    },
    stopTokenValidation: () => {
      if (tokenValidationInterval) {
        clearInterval(tokenValidationInterval);
      }
    }
  };
}

export const userStore = createUserStore();

async function validateToken() {
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 401) {
      // Token is invalid, attempt to refresh
      return await userStore.refreshToken();
    }
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}