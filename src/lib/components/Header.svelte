<script lang="ts">
  import { userStore } from "$lib/stores/auth";
  import { Menu, LogOut, RotateCw } from "lucide-svelte";
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import { characterStore } from "$lib/stores/characters";
  import { inventoryStore } from "$lib/stores/inventory";
  import { onMount } from "svelte";

  let refreshing = false;

  function login() {
    window.location.href = "/auth/login";
  }

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      userStore.clearUser();
      userStore.stopTokenValidation(); // Stop token validation
      window.location.href = "/";
    }
  }

  async function refreshData() {
    if (refreshing || !$userStore.destinyMemberships.length) return;

    refreshing = true;
    try {
      const membership = $userStore.destinyMemberships[0];
      await characterStore.loadCharacterData(
        membership.membershipType,
        membership.membershipId,
      );
      await inventoryStore.loadInventoryData(
        membership.membershipType,
        membership.membershipId,
      );
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Attempt to refresh the token and try again
      const refreshed = await userStore.refreshToken();
      if (refreshed) {
        await refreshData();
      }
    } finally {
      refreshing = false;
    }
  }

  let refreshInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    refreshInterval = setInterval(refreshData, 2 * 60 * 1000); // 2 minutes
    return () => clearInterval(refreshInterval);
  });

  $: avatarSrc = $userStore.bungieNetUser.profilePicturePath
    ? `${BUNGIE_BASE_URL}${$userStore.bungieNetUser.profilePicturePath}`
    : "";
</script>

<header
  class="w-full py-2 px-4 flex items-center justify-between bg-background border-b"
>
  <Button variant="ghost" size="icon">
    <Menu class="h-6 w-6" />
  </Button>

  <h1 class="text-xl font-bold">my-Guardians.com : Loadout Luminary</h1>

  <div class="flex items-center space-x-2">
    {#if $userStore.bungieNetUser.membershipId}
      <Avatar>
        <AvatarImage
          src={avatarSrc}
          alt={$userStore.bungieNetUser.displayName}
        />
        <AvatarFallback
          >{$userStore.bungieNetUser.displayName.charAt(0)}</AvatarFallback
        >
      </Avatar>
      <Badge variant="secondary">{$userStore.bungieNetUser.displayName}</Badge>
      <Button
        variant="ghost"
        size="icon"
        on:click={refreshData}
        disabled={refreshing}
      >
        <RotateCw class={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
      </Button>
      <Button variant="ghost" size="sm" on:click={logout}><LogOut /></Button>
    {:else}
      <Button variant="ghost" size="sm" on:click={login}
        >Login with Bungie</Button
      >
    {/if}
    <LightSwitch />
  </div>
</header>
