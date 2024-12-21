import { store } from './shared.svelte';
import type { Item } from './types';

// Track the diff for an account inventory
export function trackInventory(username: string, inventory: Item[]) {
	const { accounts } = store;

	if (!accounts[username]) {
		accounts[username] = {
			ogInventory: inventory,
			inventory: inventory,
			newItems: [],
			removedItems: [],
			changedCounts: []
		};
	} else {
		const oldData = accounts[username].ogInventory;
		const newData = inventory as Item[];

		const oldMap = new Map(oldData.map((item) => [item.strName, item]));
		const newMap = new Map(newData.map((item) => [item.strName, item]));

		const newItems = newData.filter((item) => !oldMap.has(item.strName));
		const removedItems = oldData.filter((item) => !newMap.has(item.strName));
		const changedCounts = newData.filter((item) => {
			const oldItem = oldMap.get(item.strName);
			return oldItem && oldItem.intCount !== item.intCount;
		});

		store.accounts = {
			...accounts,
			[username]: {
				ogInventory: oldData,
				inventory: newData,
				changedCounts,
				newItems,
				removedItems
			}
		};
	}
}
