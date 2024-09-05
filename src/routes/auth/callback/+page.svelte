<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userStore } from '$lib/stores/auth.js';
    
    export let data;
    
    onMount(() => {
      if (data.body && data.body.bungieNetUser && data.body.destinyMemberships) {
        userStore.save({
          bungieNetUser: data.body.bungieNetUser,
          destinyMemberships: data.body.destinyMemberships
        });
        goto('/'); // Redirect to home page after successful login
      }
    });
</script>

<h1>Logging you in...</h1>