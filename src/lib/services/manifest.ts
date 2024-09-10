import { BUNGIE_API_ROOT, BUNGIE_BASE_URL } from "$lib/utils/constants";
import type {
  ManifestResponse,
  ManifestTable,
  VersionMetadata,
  TableMetadata,
} from "$lib/utils/types";

const MANIFEST_URL = `${BUNGIE_API_ROOT}/Destiny2/Manifest/`;
const DB_NAME = "DestinyManifest";
const METADATA_STORE = "metadata";
const TABLE_STORE = "tables";

async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(METADATA_STORE, { keyPath: "key" });
      db.createObjectStore(TABLE_STORE, { keyPath: "table" });
    };
  });
}

async function getStoredVersion(): Promise<string | null> {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const transaction = db.transaction(METADATA_STORE, "readonly");
    const store = transaction.objectStore(METADATA_STORE);
    const request = store.get("version");

    request.onsuccess = () => {
      resolve(request.result ? request.result.value : null);
    };
  });
}

async function updateStoredVersion(version: string): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(METADATA_STORE, "readwrite");
  const store = transaction.objectStore(METADATA_STORE);
  store.put({ key: "version", value: version } as VersionMetadata);
}

async function storeTable(
  tableName: string,
  data: ManifestTable,
): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(TABLE_STORE, "readwrite");
  const store = transaction.objectStore(TABLE_STORE);
  store.put({ table: tableName, data } as TableMetadata);
}

async function getTable(tableName: string): Promise<ManifestTable | null> {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const transaction = db.transaction(TABLE_STORE, "readonly");
    const store = transaction.objectStore(TABLE_STORE);
    const request = store.get(tableName);

    request.onsuccess = () => {
      resolve(request.result ? request.result.data : null);
    };
  });
}

async function fetchManifestMetadata(): Promise<ManifestResponse> {
  const response = await fetch(MANIFEST_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch manifest metadata");
  }
  return response.json();
}

async function fetchManifestTable(path: string): Promise<ManifestTable> {
  const url = `${BUNGIE_BASE_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch manifest table: ${url}`);
  }
  return response.json();
}

export async function updateManifest(
  progressCallback?: (current: number, total: number) => void,
): Promise<void> {
  const metadata = await fetchManifestMetadata();
  const storedVersion = await getStoredVersion();

  if (storedVersion === metadata.Response.version) {
    console.log("Manifest is up to date");
    progressCallback?.(1, 1); // Ensure 100% progress even if no update is needed
    return;
  }

  console.log("Updating manifest...");

  const tables = Object.entries(
    metadata.Response.jsonWorldComponentContentPaths.en,
  );
  const totalTables = tables.length;

  for (const [index, [tableName, path]] of tables.entries()) {
    const tableData = await fetchManifestTable(path);
    await storeTable(tableName, tableData);
    progressCallback?.(index + 1, totalTables);
  }

  await updateStoredVersion(metadata.Response.version);
  console.log("Manifest update complete");
}

export async function getManifestTable<T>(
  tableName: string
): Promise<Record<string, T> | null> {
  const table = await getTable(tableName);
  return table as Record<string, T> | null;
}
