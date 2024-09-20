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
  } = await request.json();

  console.log("Received optimization request:", {
    character: character.classType,
    selectedExotic,
    statPriorities,
    selectedSubclass,
    legendaryArmorCount: legendaryArmor.length,
  });

  try {
    const optimizedLoadout = await optimizeArmor(
      character,
      selectedExotic,
      statPriorities,
      selectedSubclass,
      legendaryArmor,
    );

    console.log("Optimization result:", optimizedLoadout.map(item => item.itemHash));

    return json({ optimizedLoadout });
  } catch (error) {
    console.error("Error optimizing armor:", error);
    return json({ error: "Failed to optimize armor" }, { status: 500 });
  }
};
