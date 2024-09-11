<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { BUNGIE_BASE_URL } from "$lib/utils/constants";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { characterStore } from "$lib/stores/characters";
  import { getManifestTable } from "$lib/services/manifest";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Avatar, AvatarImage } from "$lib/components/ui/avatar";
  import type { Loadout, 
                DestinyStatDefinition,
                DestinyLoadoutColorDefinition, 
                DestinyLoadoutIconDefinition,
                DestinyLoadoutNameDefinition 
              } from "$lib/utils/types";
  import type { Character } from "$lib/utils/types";

  const dispatch = createEventDispatcher<{
    selectLoadout: { loadout: Loadout; character: Character };
  }>();

  $: characters = $characterStore.characters;
  $: loadouts = $characterStore.loadouts;

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
    const statDef = await getManifestTable<DestinyStatDefinition>("DestinyStatDefinition");
    return `${BUNGIE_BASE_URL}${statDef?.[statHash]?.displayProperties?.icon ?? ''}`;
  }

  async function getLoadoutDetails(loadout: Loadout) {
    const [colorDef, iconDef, nameDef] = await Promise.all([
    getManifestTable<DestinyLoadoutColorDefinition>("DestinyLoadoutColorDefinition"),
    getManifestTable<DestinyLoadoutIconDefinition>("DestinyLoadoutIconDefinition"),
    getManifestTable<DestinyLoadoutNameDefinition>("DestinyLoadoutNameDefinition"),
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
                class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              >
                {#each loadouts[characterId]?.loadouts || [] as loadout}
                  {#await getLoadoutDetails(loadout) then details}
                    {#if details.color && details.icon && details.name}
                      <button
                        class="flex flex-col items-center"
                        on:click={() => selectLoadout(loadout, character)}
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
                        <span class="text-center text-sm">{details.name}</span>
                      </button>
                    {/if}
                  {/await}
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
