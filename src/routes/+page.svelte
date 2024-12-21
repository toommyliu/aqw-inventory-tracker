<script lang="ts">
	import { store } from '$lib/shared.svelte';

	import * as Accordion from '$lib/components/ui/accordion';
	import SearchBar from '$lib/components/search-bar.svelte';

	import { Plus, Minus, ArrowUpDown, RefreshCw } from 'lucide-svelte';

	function getCountDiff(oldCount: number, newCount: number): string {
		const diff = newCount - oldCount;
		return diff > 0 ? `+${diff}` : diff.toString();
	}
</script>

<div>
	<SearchBar />

	{#if Object.keys(store.accounts).length > 0}
		<div class="flex flex-col items-center space-y-4">
			{#each Object.entries(store.accounts) as [username, data]}
				<Accordion.Root class="w-[50%]">
					<Accordion.Item value="item-1">
						<Accordion.Trigger
							class="flex w-full items-center justify-between rounded-md p-4 dark:bg-gray-800 dark:text-white"
						>
							<span class="font-medium">{username}</span>
							<div class="flex items-center gap-4">
								<div class="flex gap-2 text-sm">
									<span class="text-green-600 dark:text-green-400">{data.newItems.length} new</span>
									<span class="text-red-600 dark:text-red-400"
										>{data.removedItems.length} removed</span
									>
									<span class="text-blue-600 dark:text-blue-400"
										>{data.changedCounts.length} changed</span
									>
								</div>
							</div>
						</Accordion.Trigger>
						<Accordion.Content class="rounded-md p-4 dark:bg-gray-800 dark:text-white">
							{#if data.changedCounts.length > 0}
								<div class="mb-4">
									<h3 class="mb-2 font-semibold text-blue-600 dark:text-blue-400">
										Changed Quantities
									</h3>
									<div class="space-y-2">
										{#each data.changedCounts as item}
											{@const oldItem = data.ogInventory.find((i) => i.strName === item.strName)}
											{@const diff = oldItem ? getCountDiff(oldItem.intCount, item.intCount) : '0'}
											<div
												class="flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20"
											>
												<div class="flex items-center gap-2">
													<ArrowUpDown size={16} class="text-blue-600 dark:text-blue-400" />
													<span>{item.strName}</span>
												</div>
												<div class="flex items-center gap-2">
													<span class="text-gray-500 dark:text-gray-400">{oldItem?.intCount}</span>
													<span class="text-blue-600 dark:text-blue-400">→</span>
													<span>{item.intCount}</span>
													<span
														class="text-sm {diff.startsWith('+')
															? 'text-green-600 dark:text-green-400'
															: 'text-red-600 dark:text-red-400'}"
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
									<h3 class="mb-2 font-semibold text-green-600 dark:text-green-400">New Items</h3>
									<div class="space-y-2">
										{#each data.newItems as item}
											<div
												class="flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-900/20"
											>
												<div class="flex items-center gap-2">
													<Plus size={16} class="text-green-600 dark:text-green-400" />
													<span>{item.strName}</span>
												</div>
												<span>{item.intCount}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							{#if data.removedItems.length > 0}
								<div class="mb-4">
									<h3 class="mb-2 font-semibold text-red-600 dark:text-red-400">Removed Items</h3>
									<div class="space-y-2">
										{#each data.removedItems as item}
											<div
												class="flex items-center justify-between rounded-lg bg-red-50 p-2 dark:bg-red-900/20"
											>
												<div class="flex items-center gap-2">
													<Minus size={16} class="text-red-600 dark:text-red-400" />
													<span>{item.strName}</span>
												</div>
												<span>{item.intCount}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<div>
								<h3 class="mb-2 font-semibold dark:text-white">Current Inventory</h3>
								<div class="space-y-2">
									{#each data.inventory as item}
										<div
											class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700"
										>
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
