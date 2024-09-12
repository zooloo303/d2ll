<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Drawer,
		DrawerContent,
		DrawerHeader,
					DrawerTitle,
					DrawerFooter
	} from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import { updateLoadoutIdentifiers } from '$lib/services/loadoutActions';
	import { getManifestTable } from '$lib/services/manifest';
	import type {
		Loadout,
		Character,
		DestinyLoadoutColorDefinition,
		DestinyLoadoutIconDefinition,
		DestinyLoadoutNameDefinition
	} from '$lib/utils/types';
	import { BUNGIE_BASE_URL } from '$lib/utils/constants';

	export let loadout: Loadout;
	export let loadoutIndex: number;
	export let character: Character;
	export let open = false;

	let colors: Record<number, DestinyLoadoutColorDefinition> = {};
	let icons: Record<number, DestinyLoadoutIconDefinition> = {};
	let names: Record<number, DestinyLoadoutNameDefinition> = {};

	let selectedColor: number = loadout.colorHash;
	let selectedIcon: number = loadout.iconHash;
	let selectedName: number = loadout.nameHash;

	onMount(async () => {
		colors = await getManifestTable<DestinyLoadoutColorDefinition>('DestinyLoadoutColorDefinition');
		icons = await getManifestTable<DestinyLoadoutIconDefinition>('DestinyLoadoutIconDefinition');
		names = await getManifestTable<DestinyLoadoutNameDefinition>('DestinyLoadoutNameDefinition');
	});

	async function handleSubmit() {
		await updateLoadoutIdentifiers(
			loadoutIndex,
			character.characterId,
			character.membershipType,
			selectedColor,
			selectedIcon,
			selectedName
		);
		open = false;
	}

	function parseHash(hash: string | number): number {
		return typeof hash === 'string' ? parseInt(hash, 10) : hash;
	}
</script>


<Drawer bind:open>
	<DrawerContent>
		<DrawerHeader>
			<DrawerTitle>Update Loadout Identifiers</DrawerTitle>
			</DrawerHeader>
		<div class="space-y-4 p-4">
			<div>
				<h3 class="mb-2 text-lg font-semibold">Color</h3>
				<ToggleGroup type="single" bind:value={selectedColor}>
					{#each Object.entries(colors) as [hash, color]}
						<ToggleGroupItem value={parseHash(hash)}>
							<img
								src="{BUNGIE_BASE_URL}{color.colorImagePath}"
								alt="Loadout Color"
								class="h-8 w-8 rounded"
							/>
						</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			</div>
			<div>
				<h3 class="mb-2 text-lg font-semibold">Icon</h3>
				<ToggleGroup type="single" bind:value={selectedIcon}>
					{#each Object.entries(icons) as [hash, icon]}
						<ToggleGroupItem value={parseHash(hash)}>
							<img
								src="{BUNGIE_BASE_URL}{icon.iconImagePath}"
								alt="Loadout Icon"
								class="h-8 w-8"
							/>
						</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			</div>
			<div>
				<h3 class="mb-2 text-lg font-semibold">Name</h3>
				<ToggleGroup type="single" bind:value={selectedName}>
					{#each Object.entries(names) as [hash, name]}
						<ToggleGroupItem value={parseHash(hash)}>
							{name.name}
						</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			</div>
		</div>
		<DrawerFooter>
			<Button on:click={handleSubmit}>Update Loadout</Button>
		</DrawerFooter>
	</DrawerContent>
</Drawer>
