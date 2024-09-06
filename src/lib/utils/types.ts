import type { Cookies } from "@sveltejs/kit";

export interface BungieApiEvent {
  fetch: typeof fetch;
  cookies: Cookies;
}

export interface BungieNetUser {
  membershipId: string;
  displayName: string;
  profilePicturePath: string;
}

export interface UserData {
  bungieNetUser: BungieNetUser;
  destinyMemberships: Array<{
    membershipType: number;
    membershipId: string;
    // Add other properties as needed
  }>;
}

export interface ManifestTable {
  [key: string]: {
    [subKey: string]: unknown;
  };
}

export interface ManifestResponse {
  Response: {
    version: string;
    jsonWorldComponentContentPaths: {
      en: {
        [key: string]: string;
      };
    };
  };
}
export type ManifestTableName =
  | "DestinyNodeStepSummaryDefinition"
  | "DestinyArtDyeChannelDefinition"
  | "DestinyArtDyeReferenceDefinition"
  | "DestinyPlaceDefinition"
  | "DestinyActivityDefinition"
  | "DestinyActivityTypeDefinition"
  | "DestinyClassDefinition"
  | "DestinyGenderDefinition"
  | "DestinyInventoryBucketDefinition"
  | "DestinyRaceDefinition"
  | "DestinyTalentGridDefinition"
  | "DestinyUnlockDefinition"
  | "DestinyStatGroupDefinition"
  | "DestinyProgressionMappingDefinition"
  | "DestinyFactionDefinition"
  | "DestinyVendorGroupDefinition"
  | "DestinyRewardSourceDefinition"
  | "DestinyUnlockValueDefinition"
  | "DestinyRewardMappingDefinition"
  | "DestinyRewardSheetDefinition"
  | "DestinyItemCategoryDefinition"
  | "DestinyDamageTypeDefinition"
  | "DestinyActivityModeDefinition"
  | "DestinyMedalTierDefinition"
  | "DestinyAchievementDefinition"
  | "DestinyActivityGraphDefinition"
  | "DestinyActivityInteractableDefinition"
  | "DestinyBondDefinition"
  | "DestinyCharacterCustomizationCategoryDefinition"
  | "DestinyCharacterCustomizationOptionDefinition"
  | "DestinyCollectibleDefinition"
  | "DestinyDestinationDefinition"
  | "DestinyEntitlementOfferDefinition"
  | "DestinyEquipmentSlotDefinition"
  | "DestinyEventCardDefinition"
  | "DestinyFireteamFinderActivityGraphDefinition"
  | "DestinyFireteamFinderActivitySetDefinition"
  | "DestinyFireteamFinderLabelDefinition"
  | "DestinyFireteamFinderLabelGroupDefinition"
  | "DestinyFireteamFinderOptionDefinition"
  | "DestinyFireteamFinderOptionGroupDefinition"
  | "DestinyStatDefinition"
  | "DestinyInventoryItemDefinition"
  | "DestinyInventoryItemLiteDefinition"
  | "DestinyItemTierTypeDefinition"
  | "DestinyLoadoutColorDefinition"
  | "DestinyLoadoutIconDefinition"
  | "DestinyLoadoutNameDefinition"
  | "DestinyLocationDefinition"
  | "DestinyLoreDefinition"
  | "DestinyMaterialRequirementSetDefinition"
  | "DestinyMetricDefinition"
  | "DestinyObjectiveDefinition"
  | "DestinySandboxPerkDefinition"
  | "DestinyPlatformBucketMappingDefinition"
  | "DestinyPlugSetDefinition"
  | "DestinyPowerCapDefinition"
  | "DestinyPresentationNodeDefinition"
  | "DestinyProgressionDefinition"
  | "DestinyProgressionLevelRequirementDefinition"
  | "DestinyRecordDefinition"
  | "DestinyRewardAdjusterPointerDefinition"
  | "DestinyRewardAdjusterProgressionMapDefinition"
  | "DestinyRewardItemListDefinition"
  | "DestinySackRewardItemListDefinition"
  | "DestinySandboxPatternDefinition"
  | "DestinySeasonDefinition"
  | "DestinySeasonPassDefinition"
  | "DestinySocialCommendationDefinition"
  | "DestinySocketCategoryDefinition"
  | "DestinySocketTypeDefinition"
  | "DestinyTraitDefinition"
  | "DestinyUnlockCountMappingDefinition"
  | "DestinyUnlockEventDefinition"
  | "DestinyUnlockExpressionMappingDefinition"
  | "DestinyVendorDefinition"
  | "DestinyMilestoneDefinition"
  | "DestinyActivityModifierDefinition"
  | "DestinyReportReasonCategoryDefinition"
  | "DestinyArtifactDefinition"
  | "DestinyBreakerTypeDefinition"
  | "DestinyChecklistDefinition"
  | "DestinyEnergyTypeDefinition"
  | "DestinySocialCommendationNodeDefinition"
  | "DestinyGuardianRankDefinition"
  | "DestinyGuardianRankConstantsDefinition"
  | "DestinyLoadoutConstantsDefinition"
  | "DestinyFireteamFinderConstantsDefinition";

export interface CacheableValue {
  [key: string]: unknown;
  table?: string;
  data?: ManifestTable;
}
export interface MetadataValue {
  key: string;
  value: string;
}
export interface VersionMetadata {
  key: "version";
  value: string;
}

export interface TableMetadata {
  table: string;
  data: ManifestTable;
}

// Character related types
export enum ClassType {
  Titan = 0,
  Hunter = 1,
  Warlock = 2,
  Unknown = 3,
}

export interface Character {
  characterId: string;
  dateLastPlayed: string;
  minutesPlayedTotal: string;
  light: number;
  stats: { [key: string]: number };
  raceType: number;
  genderType: number;
  classType: ClassType;
  emblemPath: string;
  emblemBackgroundPath: string;
  emblemColor: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  };
  // Add other relevant character fields
}

// Item related types
export interface InventoryItem {
  itemHash: number;
  itemInstanceId: string;
  quantity: number;
  bindStatus: number;
  location: number;
  bucketHash: number;
  transferStatus: number;
  lockable: boolean;
  state: number;
  overrideStyleItemHash: number;
  // Add other base properties as needed
}

export interface ItemInstance {
  damageType: number;
  damageTypeHash: number;
  primaryStat?: {
    statHash: number;
    value: number;
  };
  itemLevel: number;
  quality: number;
  isEquipped: boolean;
  canEquip: boolean;
  equipRequiredLevel: number;
  unlockHashesRequiredToEquip: number[];
  cannotEquipReason: number;
}

export interface ItemStats {
  [statHash: number]: {
    statHash: number;
    value: number;
  };
}

export interface ItemSocket {
  plugItemHash: number;
  canInsert: boolean;
  enabled: boolean;
}

export interface ItemComponents {
  instances: { data: { [itemInstanceId: string]: ItemInstance } };
  stats: { data: { [itemInstanceId: string]: ItemStats } };
  sockets: { data: { [itemInstanceId: string]: { sockets: ItemSocket[] } } };
}

export interface InventoryItemWithComponents extends InventoryItem {
  instance?: ItemInstance;
  stats?: ItemStats;
  sockets?: { sockets: ItemSocket[] };
}

export interface ItemDefinition {
  displayProperties: {
    name: string;
    icon: string;
  };
  itemType: number;
  itemSubType: number;
  classType: number;
  inventory: {
    bucketTypeHash: number;
  };
  defaultDamageTypeHash?: number;
}
export interface DestinyInventoryBucketDefinition {
  displayProperties: {
    name: string;
    // Add other properties as needed
  };
  // Add other properties as needed
}
export interface DestinyStatDefinition {
  displayProperties: {
    description: string;
    name: string;
    icon: string;
    hasIcon: boolean;
  };
}

export interface CharacterLoadouts {
  [characterId: string]: {
    loadouts: Loadout[];
  };
}

export interface Loadout {
  colorHash: number;
  iconHash: number;
  nameHash: number;
  items: LoadoutItem[];
}

export interface LoadoutItem {
  itemInstanceId: string;
  plugItemHashes: number[];
}

export interface DestinyLoadoutColorDefinition {
  colorImagePath: string;
}

export interface DestinyLoadoutIconDefinition {
  iconImagePath: string;
}

export interface DestinyLoadoutNameDefinition {
  name: string;
}

export interface CompleteInventoryResponse {
  profileInventory: {
    items: InventoryItem[];
  };
  characterInventories: {
    [characterId: string]: {
      items: InventoryItem[];
    };
  };
  characterEquipment: {
    [characterId: string]: {
      items: InventoryItem[];
    };
  };
  itemComponents: ItemComponents;
}

export interface DestinyInventoryItemDefinition {
  itemType: number;
  // Add other properties as needed
}

export enum DestinyItemType {
  Subclass = 16,
  Weapon = 3,
  Armor = 2,
  // Add other item types as needed
}

export interface DestinyLoadoutActionRequest {
  loadoutIndex: number;
  characterId: string;
  membershipType: number;
}

export interface DestinyLoadoutUpdateActionRequest
  extends DestinyLoadoutActionRequest {
  colorHash?: number;
  iconHash?: number;
  nameHash?: number;
}

export interface LoadoutActionResponse {
  Response: number;
  ErrorCode: number;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: { [key: string]: string };
  DetailedErrorTrace?: string;
}

export interface DestinyItemTransferRequest {
  itemReferenceHash: number;
  stackSize: number;
  transferToVault: boolean;
  itemId: string;
  characterId: string;
  membershipType: number;
}

export interface DestinyPostmasterTransferRequest {
  itemReferenceHash: number;
  stackSize: number;
  itemId: string;
  characterId: string;
  membershipType: number;
}

export interface DestinyItemActionRequest {
  itemId: string;
  characterId: string;
  membershipType: number;
}

export interface DestinyItemSetActionRequest {
  itemIds: string[];
  characterId: string;
  membershipType: number;
}

export interface DestinyEquipItemResults {
  equipResults: {
    itemInstanceId: string;
    equipStatus: number;
  }[];
}

export type BungieApiRequestBody =
  | DestinyLoadoutActionRequest
  | DestinyLoadoutUpdateActionRequest
  | DestinyItemTransferRequest
  | DestinyPostmasterTransferRequest
  | DestinyItemActionRequest
  | DestinyItemSetActionRequest
  | Record<string, never>;
