import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type {
  Character,
  InventoryItem,
  ItemStats,
  ItemInstance,
} from "$lib/utils/types";
import { ANTHROPIC_API_KEY } from "$env/static/private";

const anthropic = createAnthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export async function optimizeArmor(
  character: Character,
  selectedExotic: {
    item: InventoryItem;
    instance: ItemInstance;
    stats: ItemStats;
    definition: any;
  },
  statPriorities: string[],
  selectedSubclass: string,
  legendaryArmor: {
    item: InventoryItem;
    instance: ItemInstance;
    stats: ItemStats;
    definition: any;
  }[],
  subclassFragments: InventoryItem[],
  armorMods: InventoryItem[],
): Promise<InventoryItem[]> {
  // Prepare the prompt for the AI
  const prompt = `
    Optimize an armor loadout for a Destiny 2 ${getClassName(character.classType)} character.
    Exotic armor: ${selectedExotic ? selectedExotic : "None"}
    Subclass: ${selectedSubclass}
    Stat priorities: ${statPriorities.join(", ")}
    Subclass fragments: ${subclassFragments.map((item) => item.itemHash).join(", ")}
    Armor mods: ${armorMods.map((item) => item.itemHash).join(", ")}

    Available armor:
    ${legendaryArmor.map((item) => `${item.item.itemHash}: ${formatItemStats(item.stats)}`).join("\n")}

    Please provide the optimal loadout as a list of item hashes, one per line, in this order:
    Helmet
    Gauntlets
    Chest
    Legs
    Class Item

    Aim to maximize the top priority stats, getting as many to 100 as possible, while considering the selected exotic and subclass synergies.
    Ensure that each armor piece is unique and no duplicates are included in the loadout.
  `;

  console.log("Input data for optimization:", {
    character: character.classType,
    selectedExotic,
    statPriorities,
    selectedSubclass,
    legendaryArmorCount: legendaryArmor.length,
    subclassFragmentsCount: subclassFragments.length,
    armorModsCount: armorMods.length,
  });

  try {
    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt: prompt,
    });

    console.log("AI response:", text);

    // Parse the AI response
    const optimizedHashes = text.trim().split("\n");

    console.log("Parsed optimized hashes:", optimizedHashes);

    // Convert hashes back to InventoryItems
    const optimizedLoadout = optimizedHashes
      .map((hash) => {
        const item = legendaryArmor.find(
          (armor) => armor.item.itemHash.toString() === hash,
        );
        return item ? item.item : null;
      })
      .filter((item): item is InventoryItem => item !== null);

    console.log("Optimized loadout:", optimizedLoadout.map(item => item.itemHash));

    return optimizedLoadout;
  } catch (error) {
    console.error("Error optimizing armor:", error);
    throw new Error("Failed to optimize armor");
  }
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

function formatItemStats(stats: ItemStats): string {
  return Object.entries(stats)
    .map(([statHash, stat]) => `${statHash}:${stat.value}`)
    .join(",");
}
