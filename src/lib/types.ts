export type Item = {
	bCoins: boolean;
	bUpgrade: boolean;
	intCharId: number;
	intCount: number;
	sortOrder: number;
	strName: string;
	strType: string;
};

export type AccountData = {
	ogInventory: Item[];
	inventory: Item[];
	newItems: Item[];
	removedItems: Item[];
	changedCounts: Item[];
};
