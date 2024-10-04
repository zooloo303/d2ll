<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { userStore } from "$lib/stores/auth";

  import HeadNav from "$lib/components/HeadNav.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  // import { Progress } from "$lib/components/ui/progress";

  $effect(() => {
    async function initializeStores() {
      await userStore.init();
    }

    initializeStores();
  });

  // function toggleNav() {
  //   isNavOpen = !isNavOpen;
  // }

  let { children } = $props();
</script>

<!-- {#if manifestLoading}
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
{/if} -->

<ModeWatcher />
<HeadNav />

<Toaster />
{@render children()}
