import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type {
  Character,
  InventoryItem,
  ItemStats,
  ItemInstance,
  DestinyInventoryItemDefinition,
} from "$lib/utils/types";
import { ANTHROPIC_API_KEY } from "$env/static/private";

type ExoticArmor = {
  itemHash: string;
  itemInstanceId: string;
  name: string;
  itemTypeDisplayName: string;
  stats: {
    [statHash: string]: {
      statHash: string;
      value: number;
    };
  };
};
type ModsAndFragments = {
  itemHash: string;
  name: string;
  description: string;
  icon: string;
  stats: [statTypeHash: number, value: number, isConditionallyActive: boolean];
};

const anthropic = createAnthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// function getClassName(classType: number): string {
//   switch (classType) {
//     case 0:
//       return "Titan";
//     case 1:
//       return "Hunter";
//     case 2:
//       return "Warlock";
//     default:
//       return "Unknown";
//   }
// }

function formatExoticArmor(exotic: ExoticArmor | null): string {
  if (!exotic) {
    return "No exotic armor selected";
  }
  return `
    Name: ${exotic.name}
    Type: ${exotic.itemTypeDisplayName}
    ItemHash: ${exotic.itemHash}
    ItemInstanceId: ${exotic.itemInstanceId}
    Stats: ${formatItemStats(exotic.stats)}
  `;
}

function formatLegendaryArmor(
  armor: {
    item: InventoryItem;
    instance: ItemInstance;
    stats: ItemStats;
    definition: DestinyInventoryItemDefinition;
  }[],
) {
  return armor
    .map(
      (piece) => `
    Name: ${piece.definition.displayProperties.name}
    Type: ${piece.definition.itemTypeDisplayName}
    ItemHash: ${piece.item.itemHash}
    ItemInstanceId: ${piece.item.itemInstanceId}
    Stats: ${formatItemStats(piece.stats)}
  `,
    )
    .join("\n");
}

function formatSubclassFragments(fragments: ModsAndFragments[]) {
  console.log("Subclass fragments:", JSON.stringify(fragments, null, 2));

  return fragments
    .map(
      (fragment) => `
    Name: ${fragment.name}
    ItemHash: ${fragment.itemHash}
    InvestmentStats: ${formatInvestmentStats(fragment.stats)}
  `,
    )
    .join("\n");
}

function formatArmorMods(mods: ModsAndFragments[]) {
  return mods
    .map(
      (mod) => `
    Name: ${mod.name}
    ItemHash: ${mod.itemHash}
    InvestmentStats: ${formatInvestmentStats(mod.stats)}
  `,
    )
    .join("\n");
}

function formatItemStats(stats: ItemStats): string {
  return Object.entries(stats)
    .map(([statHash, stat]) => `${statHash}:${stat.value}`)
    .join(", ");
}

interface InvestmentStat {
  statTypeHash: number;
  value: number;
}

function formatInvestmentStats(stats: InvestmentStat[]): string {
  return stats.map((stat) => `${stat.statTypeHash}:${stat.value}`).join(", ");
}

export async function optimizeArmor(
  character: Character,
  selectedExotic: ExoticArmor | null,
  statPriorities: string[],
  selectedSubclass: string,
  legendaryArmor: {
    item: InventoryItem;
    instance: ItemInstance;
    stats: ItemStats;
    definition: DestinyInventoryItemDefinition;
  }[],
  subclassFragments: DestinyInventoryItemDefinition[],
  armorMods: DestinyInventoryItemDefinition[],
): Promise<InventoryItem[]> {
  // Prepare the prompt for the AI
  const prompt = `As a Destiny 2 armor optimization expert and grumpy sweeper robot, please analyze the following armor pieces, subclass fragments, and armor mods to suggest the best loadout for maximizing overall stats.
      The player is using the ${selectedSubclass} subclass and must use the following exotic armor piece:

      ${formatExoticArmor(selectedExotic)}

      The stat priorities are (in order): ${statPriorities.join(", ")}.
      Here's the data:

      Legendary Armor Pieces:
      ${formatLegendaryArmor(legendaryArmor)}

      Subclass fragments:
      ${formatSubclassFragments(subclassFragments)}

      Armor Mods:
      ${formatArmorMods(armorMods)}

      Please provide your suggestion in the following JSON format, enclosed in a code block:

      \`\`\`json
      {
          "armor_pieces": [
          {
              "type": "Helmet",
              "instanceId": "item_instance_id",
              "name": "Item Name"
          },
          {
              "type": "Gauntlets",
              "instanceId": "item_instance_id",
              "name": "Item Name"
          },
          {
              "type": "Chest Armor",
              "instanceId": "item_instance_id",
              "name": "Item Name"
          },
          {
              "type": "Leg Armor",
              "instanceId": "item_instance_id",
              "name": "Item Name"
          },
          {
              "type": "Class Item",
              "instanceId": "item_instance_id",
              "name": "Item Name"
          }
      ],
          "fragments": [
              {
                  "name": "Fragment Name"
              },
              // ... other fragments (max 4)
          ],
          "mods": [
              {
                  "slot": "Helmet",
                  "name": "Mod Name"
              },
              // ... other mods (including one for Class Item)
          ],
          "total_stats": {
              "mobility": 0,
              "resilience": 0,
              "recovery": 0,
              "discipline": 0,
              "intellect": 0,
              "strength": 0
          },
          "explanation": "Your explanation here"
      }
      \`\`\`

      Ensure that you follow this JSON structure exactly in your response, enclosed in the code block as shown.

      Rules for optimization:
      - The total of all stats must not exceed 340 points (34 tiers)
      - Each individual stat can't exceed 100 points (10 tiers)
      - Prioritize stats according to the given order, ignore balancing the build, maximize as many of the priority stats as possible
      - Consider synergies between armor pieces, mods, and fragments
      - Explain any trade-offs made in your choices
      - Ensure the recommendations are compatible with the ${selectedSubclass} subclass`;

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
      model: anthropic("claude-3-5-sonnet-20240620"),
      prompt: prompt,
    });

    console.log("AI response:", text);

    // Extract the JSON part from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?\n)```/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from AI response");
    }

    const jsonString = jsonMatch[1];
    const parsedResponse = JSON.parse(jsonString);

    console.log("Parsed AI response:", parsedResponse);

    // Extract armor pieces from the parsed response
    const optimizedLoadout = parsedResponse.armor_pieces
      .map((piece: { instanceId: string; type: string; name: string }) => {
        const item = legendaryArmor.find(
          (armor) => armor.item.itemInstanceId === piece.instanceId,
        );
        return item ? item.item : null;
      })
      .filter((item): item is InventoryItem => item !== null);

    console.log(
      "Optimized loadout:",
      optimizedLoadout.map((item) => item.itemHash),
    );

    return optimizedLoadout;
  } catch (error) {
    console.error("Error optimizing armor:", error);
    throw new Error("Failed to optimize armor");
  }
}
