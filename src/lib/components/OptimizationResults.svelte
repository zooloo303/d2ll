<script lang="ts">
	import { onMount } from 'svelte';
	import Item from '$lib/components/Item.svelte';
	import type { InventoryItem } from '$lib/utils/types';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { findItemInInventory } from '$lib/utils/helpers';
	import { inventoryStore } from '$lib/stores/inventory';
	import { equipItems, transferItem } from '$lib/services/itemActions';
	import { characterStore } from '$lib/stores/characters';

	export let loadout: InventoryItem[];
	export let fragments: { name: string }[];
	export let mods: { slot: string; name: string }[];
	export let totalStats: { [key: string]: number };
	export let selectedExotic: InventoryItem | null;
	export let aiResponse: string;
	export let characterId: string;

	let dialogOpen = false;
	let stagingItems: InventoryItem[] = [];

	$: character = $characterStore.characters[characterId];

	onMount(() => {
		dialogOpen = true;
		identifyStagingItems();
	});

	function identifyStagingItems() {
		stagingItems = loadout.filter((item) => {
			const itemLocation = findItemInInventory($inventoryStore, item.itemInstanceId);
			return itemLocation && itemLocation.location !== characterId;
		});
	}

	async function stageItems() {
		for (const item of stagingItems) {
			await transferItem(
				item.itemHash,
				1,
				false,
				item.itemInstanceId,
				characterId,
				character.membershipType
			);
		}
		stagingItems = [];
	}

	async function equipAllItems() {
		const itemIds = loadout.map((item) => item.itemInstanceId);
		await equipItems(itemIds, characterId, character.membershipType);
	}
</script>

<Dialog bind:open={dialogOpen}>
	<DialogContent class="sm:max-w-[60%]">
		<DialogHeader>
			<DialogTitle>Optimized Loadout</DialogTitle>
			<DialogDescription>
				Here's your optimized loadout based on the selected criteria.
			</DialogDescription>
		</DialogHeader>

		<div class="flex flex-col justify-start gap-4">
			{#if selectedExotic}
				<div class="flex flex-row items-center justify-start gap-4">
					<h3 class="mb-2 text-lg font-semibold">Selected Exotic</h3>
					<Item item={selectedExotic} />
				</div>
			{/if}
			<div class="flex flex-row items-center justify-between gap-4">
        <h3 class="mb-2 text-lg font-semibold">Suggested Armor</h3>
				{#each loadout as item, index (item.itemInstanceId || `${item.itemHash}-${index}`)}
					<Item {item} />
				{/each}
			</div>
		</div>
		<div class="flex flex-row justify-start gap-20">
			<div class="col-span-5">
				<h3 class="mb-2 text-lg font-semibold">Subclass Fragments</h3>
				<ul>
					{#each fragments as fragment}
						<li>{fragment.name}</li>
					{/each}
				</ul>
			</div>

			<div class="col-span-5">
				<h3 class="mb-2 text-lg font-semibold">Armor Mods</h3>
				<ul>
					{#each mods as mod}
						<li>{mod.slot}: {mod.name}</li>
					{/each}
				</ul>
			</div>

			<div class="col-span-5">
				<h3 class="mb-2 text-lg font-semibold">Total Stats</h3>
				<ul>
					{#each Object.entries(totalStats) as [stat, value]}
						<li>{stat}: {value}</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-4">
			<h3 class="mb-2 text-lg font-semibold">SweeperBots commments</h3>
			<p class="whitespace-pre-wrap">{aiResponse}</p>
		</div>

		<DialogFooter>
			{#if stagingItems.length > 0}
				<Button on:click={stageItems}>
					Stage {stagingItems.length} item{stagingItems.length !== 1 ? 's' : ''}
				</Button>
			{/if}
			<Button on:click={equipAllItems}>Equip All</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

{#if !dialogOpen}
	<Button on:click={() => (dialogOpen = true)}>Show Optimization Results</Button>
{/if}
