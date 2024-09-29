<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { userStore } from "$lib/stores/auth";
  import { manifestStore } from "$lib/stores/manifest";
  import { characterStore } from "$lib/stores/characters";
  import { inventoryStore } from "$lib/stores/inventory";
  import Header from "$lib/components/Header.svelte";
  // import Navbar from "$lib/components/Navbar.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Progress } from "$lib/components/ui/progress";

  let manifestLoading = $state(true);
  // let isNavOpen = $state(false);

  $effect(() => {
    async function initializeStores() {
      await userStore.init();
      characterStore.init();
      inventoryStore.init();
      await manifestStore.init();

      if ($userStore.destinyMemberships.length > 0) {
        const membership = $userStore.destinyMemberships[0];
        await characterStore.loadCharacterData(
          membership.membershipType,
          membership.membershipId,
        );
        await inventoryStore.loadInventoryData(
          membership.membershipType,
          membership.membershipId,
        );
      }

      manifestLoading = false;
    }

    initializeStores();
  });

  // function toggleNav() {
  //   isNavOpen = !isNavOpen;
  // }

  let { children } = $props();
</script>

{#if manifestLoading}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
  >
    <div class="w-[300px] space-y-4">
      <h2 class="text-center text-xl font-semibold">
        Loading Destiny 2 Manifest
      </h2>
      <Progress value={$manifestStore.progress} />
    </div>
  </div>
{/if}

<ModeWatcher />
<Header/>

<Toaster />
{@render children()}
