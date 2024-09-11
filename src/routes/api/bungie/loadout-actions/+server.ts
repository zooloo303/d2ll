import { BUNGIE_API_KEY } from "$env/static/private";
import { BUNGIE_API_ROOT } from "$lib/utils/constants";
import type { RequestHandler } from "@sveltejs/kit";
import type {
  DestinyLoadoutActionRequest,
  DestinyItemTransferRequest,
  DestinyItemActionRequest,
  LoadoutActionResponse,
  BungieApiRequestBody,
} from "$lib/utils/types";

async function makeRequest(
  endpoint: string,
  body: BungieApiRequestBody,
  accessToken: string
): Promise<LoadoutActionResponse> {
  const response = await fetch(`${BUNGIE_API_ROOT}${endpoint}`, {
    method: "POST",
    headers: {
      "X-API-Key": BUNGIE_API_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  const accessToken = cookies.get("access_token");

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { action, ...requestBody } = await request.json();

  try {
    let result: LoadoutActionResponse | undefined;

    switch (action) {
      case "stageLoadout":
        // Implement staging logic here
        throw new Error("Staging not implemented");
      case "equipLoadout":
        result = await makeRequest(
          "/Destiny2/Actions/Loadouts/EquipLoadout/",
          requestBody as DestinyLoadoutActionRequest,
          accessToken
        );
        break;
      case "snapshotLoadout":
        result = await makeRequest(
          "/Destiny2/Actions/Loadouts/SnapshotLoadout/",
          requestBody as DestinyLoadoutActionRequest,
          accessToken
        );
        break;
      case "clearLoadout":
        result = await makeRequest(
          "/Destiny2/Actions/Loadouts/ClearLoadout/",
          requestBody as DestinyLoadoutActionRequest,
          accessToken
        );
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
        });
    }

    if (!result) {
      throw new Error("Action did not produce a result");
    }

    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error("Error performing loadout action:", error);
    return new Response(
      JSON.stringify({ error: "Failed to perform loadout action" }),
      { status: 500 }
    );
  }
};
