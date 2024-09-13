<script lang="ts">
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { userStore } from "$lib/stores/auth";
  import { createEventDispatcher } from "svelte";
  import { Badge } from "$lib/components/ui/badge";
  import type { Character } from "$lib/utils/types";
  import { Button } from "$lib/components/ui/button";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { characterStore } from "$lib/stores/characters";
  import { getManifestTable } from "$lib/services/manifest";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { snapshotLoadout } from "$lib/services/loadoutActions";
  import { Avatar, AvatarImage } from "$lib/components/ui/avatar";
  import type {
    Loadout,
    DestinyStatDefinition,
    DestinyLoadoutColorDefinition,
    DestinyLoadoutIconDefinition,
    DestinyLoadoutNameDefinition,
  } from "$lib/utils/types";
  import {
    BUNGIE_BASE_URL,
    BUNGIE_ITEM_PLACEHOLDER,
  } from "$lib/utils/constants";

  export let selectedLoadout: Loadout | null = null;

  const MAX_LOADOUTS = 12;
  const DEFAULT_COLOR_HASH = 1677044030; // Default color
  const DEFAULT_ICON_HASH = 797343696; // Default icon
  const DEFAULT_NAME_HASH = 752612103; // Default name

  const dispatch = createEventDispatcher<{
    selectLoadout: { loadout: Loadout; character: Character };
  }>();

  $: characters = $characterStore.characters;
  $: loadouts = $characterStore.loadouts;

  function isInitialLoadout(loadout: Loadout): boolean {
    return (
      loadout.colorHash === BUNGIE_ITEM_PLACEHOLDER &&
      loadout.iconHash === BUNGIE_ITEM_PLACEHOLDER &&
      loadout.nameHash === BUNGIE_ITEM_PLACEHOLDER
    );
  }

  function getClassName(classType: number): string {
    switch (classType) {
      case 0:
        return "Titan";
      case 1:
        return "Hunter";
      case 2:
        return "Warlock";
      default:
        return "Unknown";
    }
  }

  const statOrder = [
    "1935470627", // Power
    "2996146975", // Mobility
    "392767087", // Resilience
    "1943323491", // Recovery
    "1735777505", // Discipline
    "144602215", // Intellect
    "4244567218", // Strength
  ];

  async function getStatIcon(statHash: string): Promise<string> {
    const statDef = await getManifestTable<DestinyStatDefinition>(
      "DestinyStatDefinition",
    );
    return `${BUNGIE_BASE_URL}${statDef?.[statHash]?.displayProperties?.icon ?? ""}`;
  }

  async function getLoadoutDetails(loadout: Loadout) {
    const [colorDef, iconDef, nameDef] = await Promise.all([
      getManifestTable<DestinyLoadoutColorDefinition>(
        "DestinyLoadoutColorDefinition",
      ),
      getManifestTable<DestinyLoadoutIconDefinition>(
        "DestinyLoadoutIconDefinition",
      ),
      getManifestTable<DestinyLoadoutNameDefinition>(
        "DestinyLoadoutNameDefinition",
      ),
    ]);

    return {
      color:
        colorDef && colorDef[loadout.colorHash]?.colorImagePath
          ? `${BUNGIE_BASE_URL}${colorDef[loadout.colorHash].colorImagePath}`
          : null,
      icon:
        iconDef && iconDef[loadout.iconHash]?.iconImagePath
          ? `${BUNGIE_BASE_URL}${iconDef[loadout.iconHash].iconImagePath}`
          : null,
      name: (nameDef && nameDef[loadout.nameHash]?.name) || null,
    };
  }

  function selectLoadout(loadout: Loadout, character: Character) {
    dispatch("selectLoadout", { loadout, character });
  }
  async function addNewLoadout(characterId: string, index: number) {
    try {
      const character = characters[characterId];
      await snapshotLoadout(
        index,
        character.characterId,
        character.membershipType,
        DEFAULT_COLOR_HASH,
        DEFAULT_ICON_HASH,
        DEFAULT_NAME_HASH,
      );     
      toast.success("New loadout created successfully");

      // Refresh character data to update the UI
      if ($userStore.destinyMemberships.length > 0) {
        const membership = $userStore.destinyMemberships[0];
        await characterStore.loadCharacterData(
          membership.membershipType,
          membership.membershipId,
        );
      }
    } catch (error) {
      console.error("Error adding new loadout:", error);
      toast.error("Failed to create new loadout");
    }
  }
</script>

{#if Object.keys(characters).length === 0}
  <div class="space-y-2">
    <Skeleton class="h-12 w-full" />
    <Skeleton class="h-12 w-full" />
    <Skeleton class="h-12 w-full" />
  </div>
{:else}
  <div class="p-4">
    <div class="space-y-4">
      {#each Object.entries(characters) as [characterId, character]}
        <Card>
          <CardContent>
            <div class="flex flex-row items-center p-4">
              <Avatar class="mr-4 h-16 w-16">
                <AvatarImage
                  src={`${BUNGIE_BASE_URL}${character.emblemPath}`}
                  alt="Character Emblem"
                />
              </Avatar>
              <div>
                <Badge>{getClassName(character.classType)}</Badge>
              </div>
            </div>
            <div class="flex flex-row items-center">
              <div class="p-4">
                <div class="grid grid-cols-3 gap-2">
                  {#each statOrder as statHash}
                    {#await getStatIcon(statHash) then icon}
                      <Badge
                        variant="secondary"
                        class="flex items-center justify-between"
                      >
                        <img src={icon} alt="Stat Icon" class="h-4 w-4" />
                        <span class="ml-2">{character.stats[statHash]}</span>
                      </Badge>
                    {/await}
                  {/each}
                </div>
              </div>
              <div class="p-4">
                <h3 class="mb-2 text-lg font-semibold">Loadouts</h3>
                <div
                  class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
                >
                  {#each Array(MAX_LOADOUTS) as _, index}
                    {#if loadouts[characterId]?.loadouts[index]}
                      {#await getLoadoutDetails(loadouts[characterId].loadouts[index]) then details}
                        {#if isInitialLoadout(loadouts[characterId].loadouts[index])}
                          <Button
                            variant="ghost"
                            class="mt-2 w-12 h-12"
                            on:click={() => addNewLoadout(characterId, index)}
                          >
                            <Plus class="h-6 w-6" />
                          </Button>
                        {:else if details.color && details.icon && details.name}
                          <button
                            class="flex flex-col items-center p-2 rounded-md transition-all duration-200 {selectedLoadout ===
                            loadouts[characterId].loadouts[index]
                              ? 'bg-primary/10 ring-2 ring-primary'
                              : 'hover:bg-secondary'}"
                            on:click={() =>
                              selectLoadout(
                                loadouts[characterId].loadouts[index],
                                character,
                              )}
                          >
                            <div
                              class="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-cover bg-center"
                              style="background-image: url('{details.color}');"
                            >
                              <img
                                src={details.icon}
                                alt="Loadout Icon"
                                class="h-10 w-10"
                              />
                            </div>
                            <span class="text-center text-sm"
                              >{details.name}</span
                            >
                          </button>
                        {/if}
                      {/await}
                    {:else}
                      <Button
                        variant="outline"
                        class="h-20 w-20 p-0"
                        on:click={() => addNewLoadout(characterId, index)}
                      >
                        <Plus class="h-6 w-6" />
                      </Button>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
{/if}
