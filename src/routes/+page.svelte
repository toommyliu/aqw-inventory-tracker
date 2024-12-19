<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Plus, Minus, ArrowUpDown, RefreshCw } from 'lucide-svelte';
	import axios from 'axios';

	type Item = {
		bCoins: boolean;
		bUpgrade: boolean;
		intCharId: number;
		intCount: number;
		sortOrder: number;
		strName: string;
		strType: string;
	};

	type AccountData = {
		ogInventory: Item[];
		inventory: Item[];
		newItems: Item[];
		removedItems: Item[];
		changedCounts: Item[];
	};

	let username = $state<string>('');
	let accounts: Record<string, AccountData> = $state({});
	let isLoading = $state<Record<string, boolean>>({});

	function getCountDiff(oldCount: number, newCount: number): string {
		const diff = newCount - oldCount;
		return diff > 0 ? `+${diff}` : diff.toString();
	}

	async function fetchInventory(username: string) {
		isLoading = { ...isLoading, [username]: true };

		try {
			const resp = await axios.post('/api/get-char', { username });

			if (!accounts[username]) {
				accounts = {
					...accounts,
					[username]: {
						ogInventory: resp.data.inventory,
						inventory: resp.data.inventory,
						changedCounts: [],
						newItems: [],
						removedItems: []
					}
				};
			} else {
				const oldData = accounts[username].ogInventory;
				const newData = resp.data.inventory as Item[];

				const oldMap = new Map(oldData.map((item) => [item.strName, item]));
				const newMap = new Map(newData.map((item) => [item.strName, item]));

				const newItems = newData.filter((item) => !oldMap.has(item.strName));
				const removedItems = oldData.filter((item) => !newMap.has(item.strName));
				const changedCounts = newData.filter((item) => {
					const oldItem = oldMap.get(item.strName);
					return oldItem && oldItem.intCount !== item.intCount;
				});

				accounts = {
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
		} catch (error) {
			const err = error as Error;
			console.error(err);

			if (
				'response' in err &&
				// @ts-expect-error
				'data' in err.response &&
				err?.response?.data === 'Character not found'
			) {
				toast('Character not found');
			} else {
				toast('An error occurred.');
			}
		} finally {
			isLoading = { ...isLoading, [username]: false };
		}
	}

	const handleSubmit = async (ev: Event) => {
		ev.preventDefault();
		await fetchInventory(username);
	};

	$inspect(username);
</script>

<div class="container mx-auto space-y-4 p-4">
	<div class="flex justify-center items-center min-h-screen">
		<form class="flex w-[50%] flex-row items-center justify-center gap-2" onsubmit={handleSubmit}>
			<Input
				type="text"
				placeholder="Your account username..."
				required
				class="input input-bordered w-full"
				on:change={(ev) => (username = ev.currentTarget.value)}
			/>
			<Button type="submit">Submit</Button>
		</form>
	</div>

	{#if Object.keys(accounts).length > 0}
		<div class="flex flex-col items-center space-y-4">
			{#each Object.entries(accounts) as [username, data]}
				<Accordion.Root class="w-[50%]">
					<Accordion.Item value="item-1">
						<Accordion.Trigger class="flex w-full items-center justify-between p-4">
							<span class="font-medium">{username}</span>
							<div class="flex items-center gap-4">
								<div class="flex gap-2 text-sm">
									<span class="text-green-600">{data.newItems.length} new</span>
									<span class="text-red-600">{data.removedItems.length} removed</span>
									<span class="text-blue-600">{data.changedCounts.length} changed</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onclick={(ev) => {
										ev.preventDefault();
										fetchInventory(username);
									}}
									disabled={isLoading[username]}
								>
									<RefreshCw size={16} class="mr-2 {isLoading[username] ? 'animate-spin' : ''}" />
									Refresh
								</Button>
							</div>
						</Accordion.Trigger>
						<Accordion.Content class="p-4">
							{#if data.changedCounts.length > 0}
								<div class="mb-4">
									<h3 class="mb-2 font-semibold text-blue-600">Changed Quantities</h3>
									<div class="space-y-2">
										{#each data.changedCounts as item}
											{@const oldItem = data.ogInventory.find((i) => i.strName === item.strName)}
											{@const diff = oldItem ? getCountDiff(oldItem.intCount, item.intCount) : '0'}
											<div class="flex items-center justify-between rounded-lg bg-blue-50 p-2">
												<div class="flex items-center gap-2">
													<ArrowUpDown size={16} class="text-blue-600" />
													<span>{item.strName}</span>
												</div>
												<div class="flex items-center gap-2">
													<span class="text-gray-500">{oldItem?.intCount}</span>
													<span class="text-blue-600">→</span>
													<span>{item.intCount}</span>
													<span
														class="text-sm {diff.startsWith('+')
															? 'text-green-600'
															: 'text-red-600'}"
													>
														({diff})
													</span>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							{#if data.newItems.length > 0}
								<div class="mb-4">
									<h3 class="mb-2 font-semibold text-green-600">New Items</h3>
									<div class="space-y-2">
										{#each data.newItems as item}
											<div class="flex items-center justify-between rounded-lg bg-green-50 p-2">
												<div class="flex items-center gap-2">
													<Plus size={16} class="text-green-600" />
													<span>{item.strName}</span>
												</div>
												<span>{item.intCount}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Removed Items -->
							{#if data.removedItems.length > 0}
								<div class="mb-4">
									<h3 class="mb-2 font-semibold text-red-600">Removed Items</h3>
									<div class="space-y-2">
										{#each data.removedItems as item}
											<div class="flex items-center justify-between rounded-lg bg-red-50 p-2">
												<div class="flex items-center gap-2">
													<Minus size={16} class="text-red-600" />
													<span>{item.strName}</span>
												</div>
												<span>{item.intCount}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<div>
								<h3 class="mb-2 font-semibold">Current Inventory</h3>
								<div class="space-y-2">
									{#each data.inventory as item}
										<div class="flex items-center justify-between rounded-lg bg-gray-50 p-2">
											<span>{item.strName}</span>
											<span>{item.intCount}</span>
										</div>
									{/each}
								</div>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/each}
		</div>
	{/if}
</div>
