import { writable, derived } from 'svelte/store';
import { updateManifest, getManifestTable } from '$lib/services/manifest';
import type { ManifestTableName, ManifestTable } from '$lib/utils/types';

function createManifestStore() {
    const tables = writable<{ [K in ManifestTableName]?: ManifestTable }>({});
    const progress = writable(0);

    const { subscribe } = derived([tables, progress], ([$tables, $progress]) => ({
        tables: $tables,
        progress: $progress
    }));

    return {
        subscribe,
        init: async () => {
            progress.set(0);
            await updateManifest((current, total) => {
                progress.set(Math.floor((current / total) * 100));
            });
            progress.set(100);
            console.log('Manifest initialized');
        },
        getTable: async <T>(tableName: string) => {
            const table = await getManifestTable<T>(tableName);
            if (table) {
                tables.update((current) => ({ ...current, [tableName]: table }));
            }
            return table;
        }
    };
}

export const manifestStore = createManifestStore();
