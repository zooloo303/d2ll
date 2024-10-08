export interface BungieNetUser {
  membershipId: string;
  displayName: string;
  profilePicturePath: string;
}

export interface UserData {
  bungieNetUser: {
    membershipId: string;
    displayName: string;
    profilePicturePath: string;
  };
  destinyMemberships: any[]; // Replace 'any[]' with the correct type if available
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

export interface VersionMetadata {
  key: "version";
  value: string;
}

export interface TableMetadata {
  table: string;
  data: ManifestTable;
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

// Character related types
export enum ClassType {
  Titan = 0,
  Hunter = 1,
  Warlock = 2,
  Unknown = 3,
}

export interface Character {
  characterId: string;
  membershipType: number;
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
  dismantlePermission: number;
  isWrapper: boolean;
  tooltipNotificationIndexes: number[];
  overrideStyleItemHash?: number;
}

export interface ItemComponents {
  instances: { data: { [itemInstanceId: string]: ItemInstance } };
  stats: { data: { [itemInstanceId: string]: { stats: ItemStats } } };
  sockets: { data: { [itemInstanceId: string]: { sockets: ItemSocket[] } } };
}

export interface InventoryItemWithComponents extends InventoryItem {
  instance?: ItemInstance;
  stats?: ItemStats;
  sockets?: { sockets: ItemSocket[] };
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

export interface ItemStat {
  statHash: number;
  value: number;
  minimum?: number;
  maximum?: number;
  displayMaximum?: number;
}

export interface ItemStats {
  [statHash: string]: ItemStat;
}

export interface ItemSocket {
  plugHash: number;
  isEnabled: boolean;
  isVisible: boolean;
}

export interface Loadout {
  colorHash: number;
  iconHash: number;
  nameHash: number;
  items: LoadoutItem[];
}

export interface CharacterLoadouts {
  [characterId: string]: {
    loadouts: Loadout[];
  };
}

export interface LoadoutItem {
  itemInstanceId: string;
  plugItemHashes: number[];
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

// manifest types
export interface DestinyInventoryBucketDefinition {
  displayProperties: {
    name: string;
  };
}

export interface DestinyStatDefinition {
  displayProperties: {
    name: string;
    description: string;
    icon: string;
  };
  aggregationType: number;
  hasComputedBlock: boolean;
  statCategory: number;
  interpolate: boolean;
}

export interface DestinyLoadoutColorDefinition {
  colorImagePath: string;
  hash: number;
}

export interface DestinyLoadoutIconDefinition {
  iconImagePath: string;
  hash: number;
}

export interface DestinyLoadoutNameDefinition {
  name: string;
  hash: number;
}

export interface DestinyInventoryItemDefinition {
  hash: number;
  displayProperties: {
    name: string;
    icon: string;
    description: string;
  };
  itemType: number;
  itemTypeDisplayName: string;
  itemSubType: number;
  classType: number;
  stats: ItemStats;
  investmentStats: [
    statTypeHash: number,
    value: number,
    isConditionallyActive: boolean,
  ];
  inventory?: {
    bucketTypeHash: number;
    tierType: number;
  };
  itemCategoryHashes: number[];
  defaultDamageTypeHash?: number;
  flavorText?: string;
  screenshot?: string;
  sockets?: {
    socketEntries: Array<{
      reusablePlugItems: Array<{
        plugItemHash: number;
      }>;
    }>;
  };
  hasDisplayableStats: boolean;
  primaryBaseStatHash: number;
}

export interface DestinyDamageTypeDefinition {
  displayProperties: {
    name: string;
    description: string;
    icon: string;
  };
}

export interface ExoticArmor {
  itemHash: string;
  itemInstanceId: string;
  name: string;
  itemTypeDisplayName: string;
  stats: ItemStats;
}

export interface ModsAndFragments {
  itemHash: string;
  name: string;
  description: string;
  icon: string;
  investmentStats: [number, number, boolean][];
}

export interface SlimArmorPiece {
  itemHash: string;
  itemInstanceId: string;
  name: string;
  itemTypeDisplayName: string;
  stats: ItemStats;
}
