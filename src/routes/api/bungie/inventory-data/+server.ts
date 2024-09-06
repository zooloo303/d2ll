import { BUNGIE_API_KEY } from "$env/static/private";
import { BUNGIE_API_ROOT } from "$lib/utils/constants";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
  const membershipType = url.searchParams.get("membershipType");
  const destinyMembershipId = url.searchParams.get("destinyMembershipId");
  const accessToken = cookies.get("access_token");

  if (!membershipType || !destinyMembershipId || !accessToken) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 },
    );
  }

  const apiUrl = `${BUNGIE_API_ROOT}/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=102,201,205,300,304,305`;

  const response = await fetch(apiUrl, {
    headers: {
      "X-API-Key": BUNGIE_API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch inventory data from Bungie API",
      }),
      { status: response.status },
    );
  }

  const data = await response.json();

  const inventoryData = {
    profileInventory: data.Response.profileInventory.data,
    characterInventories: data.Response.characterInventories.data,
    characterEquipment: data.Response.characterEquipment.data,
    itemComponents: data.Response.itemComponents,
  };

  return new Response(JSON.stringify(inventoryData));
};
