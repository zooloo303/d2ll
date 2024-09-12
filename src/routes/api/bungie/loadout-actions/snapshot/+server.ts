import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { DestinyLoadoutUpdateActionRequest } from "$lib/utils/types";
import { BUNGIE_API_ROOT } from "$lib/utils/constants";
import { BUNGIE_API_KEY } from "$env/static/private";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const {
      loadoutIndex,
      characterId,
      membershipType,
      colorHash,
      iconHash,
      nameHash,
    }: DestinyLoadoutUpdateActionRequest = await request.json();

    if (loadoutIndex === undefined || !characterId || !membershipType) {
      return json({ error: "Missing required parameters" }, { status: 400 });
    }

    const accessToken = cookies.get("access_token");

    if (!accessToken) {
      return json({ error: "User not authenticated" }, { status: 401 });
    }

    const response = await fetch(
      `${BUNGIE_API_ROOT}/Destiny2/Actions/Loadouts/SnapshotLoadout/`,
      {
        method: "POST",
        headers: {
          "X-API-Key": BUNGIE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loadoutIndex,
          characterId,
          membershipType,
          colorHash,
          iconHash,
          nameHash,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { error: errorData.Message || "Failed to snapshot loadout" },
        { status: response.status },
      );
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error snapshotting loadout:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
