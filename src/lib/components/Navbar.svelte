<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import { page } from "$app/stores";
  import { Boxes, PackageSearch } from "lucide-svelte";

  let isOpen: boolean = $props();

  const navItems = [
    { href: "/", label: "Loadouts", Icon: Boxes },
    { href: "/inventory", label: "Inventory", Icon: PackageSearch },
  ];

  function toggleNav() {
    isOpen = !isOpen;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      isOpen = false;
    }
  }
</script>

<nav
  class={cn(
    "fixed left-0 top-0 z-40 h-screen w-64 bg-background transition-transform",
    isOpen ? "translate-x-0" : "-translate-x-full",
  )}
  transition:slide={{ duration: 300, axis: "x" }}
>
  <div class="flex h-full flex-col overflow-y-auto p-4">
    <ul class="space-y-2">
      {#each navItems as item}
        <li>
          <a
            href={item.href}
            class={cn(
              "flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
              $page.url.pathname === item.href &&
                "bg-gray-100 dark:bg-gray-700",
            )}
          >
            <item.Icon class="h-6 w-6" />
            <span class="ml-3">{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

{#if isOpen}
  <div
    role="button"
    tabindex="0"
    class="fixed inset-0 z-30 bg-black bg-opacity-50 cursor-pointer"
    onclick={toggleNav}
    onkeydown={handleKeyDown}
    transition:fade={{ duration: 200 }}
  ></div>
{/if}

<Button
  variant="ghost"
  size="icon"
  class="fixed left-4 top-4 z-50"
  onclick={toggleNav}
>
  <Boxes class="h-6 w-6" />
  <span class="sr-only">Toggle navigation</span>
</Button>
