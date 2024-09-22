import { json } from "@sveltejs/kit";
import { optimizeArmor } from "$lib/services/armorOptimizer";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const {
    character,
    selectedExotic,
    statPriorities,
    selectedSubclass,
    legendaryArmor,
    subclassFragments,
    armorMods,
  } = await request.json();

  console.log("Received optimization request:", {
    character: character.classType,
    selectedExotic,
    statPriorities,
    selectedSubclass,
    legendaryArmorCount: legendaryArmor.length,
    subclassFragmentsCount: subclassFragments.length,
    armorModsCount: armorMods.length,
  });

  try {
    const optimizedLoadout = await optimizeArmor(
      character,
      selectedExotic,
      statPriorities,
      selectedSubclass,
      legendaryArmor,
      subclassFragments,
      armorMods,
    );

    console.log(
      "Optimization result:",
      optimizedLoadout.optimizedLoadout,
      "Optimization explanation:",
      optimizedLoadout.explanation,
    );

    return json({
      optimizedLoadout: optimizedLoadout.optimizedLoadout,
      fragments: optimizedLoadout.fragments,
      mods: optimizedLoadout.mods,
      totalStats: optimizedLoadout.totalStats,
      aiResponse: optimizedLoadout.explanation
    });
  } catch (error) {
    console.error("Error optimizing armor:", error);
    return json({ error: "Failed to optimize armor" }, { status: 500 });
  }
};
