<script lang="ts">
	import { store } from '$lib/shared.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import SearchBar from '$lib/components/search-bar.svelte';
	import { Plus, Minus, ArrowUpDown, RefreshCw, ArrowUp, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	import axios from 'axios';
	import { trackInventory } from '@/track-inventory';

	let accordionContainer: HTMLDivElement;
	let scrollToTopVisible = $state(false);

	function getCountDiff(oldCount: number, newCount: number): string {
		const diff = newCount - oldCount;
		return diff > 0 ? `+${diff}` : diff.toString();
	}

	async function refreshInventory(username: string) {
		store.isLoading[username] = true;
		try {
			const resp = await axios.post('/api/get-char', { username });
			trackInventory(username, resp.data.inventory);
			toast.success('Inventory refreshed successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to refresh inventory');
		} finally {
			store.isLoading[username] = false;
		}
	}

	function removeAccount(username: string) {
		const { [username]: removed, ...remaining } = store.accounts;
		store.accounts = remaining;
		toast.success('Successfully removed from list');
	}

	function handleScroll(ev: Event) {
		scrollToTopVisible = (ev.target as HTMLDivElement).scrollTop > 200;
	}

	function scrollToTop() {
		accordionContainer?.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="container mx-auto flex flex-col items-center px-4">
	<div class="w-full max-w-7xl">
		<SearchBar />
	</div>

	{#if Object.keys(store.accounts).length > 0}
		<div
			class="relative mt-4 flex w-full max-w-3xl flex-col space-y-4 overflow-y-auto"
			style="max-height: calc(100vh - 12rem);"
			bind:this={accordionContainer}
			onscroll={handleScroll}
		>
			{#each Object.entries(store.accounts) as [username, data]}
				<Accordion.Root value="item-1" class="space-y-4">
					<Accordion.Item value={username} class="rounded-md border dark:border-gray-700">
						<div class="w-full">
							<Accordion.Trigger
								class="flex w-full items-center rounded-t-md bg-white p-4 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700/50"
							>
								<div class="grid w-full grid-cols-[auto,1fr,auto] items-center gap-4">
									<button
										class="rounded-full p-1 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
										onclick={(ev) => {
											ev.stopPropagation();
											removeAccount(username);
										}}
										title="Remove account"
									>
										<X size={16} />
									</button>
									<span class="truncate font-medium">{username}</span>
									<div class="flex items-center gap-4">
										<div class="hidden grid-cols-3 gap-2 text-sm sm:grid sm:w-64">
											<span class="whitespace-nowrap text-green-600 dark:text-green-400"
												>{data.newItems.length} new</span
											>
											<span class="whitespace-nowrap text-red-600 dark:text-red-400"
												>{data.removedItems.length} removed</span
											>
											<span class="whitespace-nowrap text-blue-600 dark:text-blue-400"
												>{data.changedCounts.length} changed</span
											>
										</div>
										<div class="flex gap-2 text-sm sm:hidden">
											<span class="text-green-600 dark:text-green-400">+{data.newItems.length}</span
											>
											<span class="text-red-600 dark:text-red-400">-{data.removedItems.length}</span
											>
											<span class="text-blue-600 dark:text-blue-400"
												>~{data.changedCounts.length}</span
											>
										</div>
										<button
											class="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
											onclick={(ev) => {
												ev.stopPropagation();
												refreshInventory(username);
											}}
											title="Refresh inventory"
											disabled={store.isLoading[username]}
										>
											<RefreshCw
												size={16}
												class="text-gray-500 dark:text-gray-400 {store.isLoading[username]
													? 'animate-spin'
													: ''}"
											/>
										</button>
									</div>
								</div>
							</Accordion.Trigger>
						</div>
						<Accordion.Content
							class="border-t bg-white p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						>
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
												<div class="flex min-w-0 items-center gap-2">
													<ArrowUpDown
														size={16}
														class="flex-shrink-0 text-blue-600 dark:text-blue-400"
													/>
													<span class="truncate">{item.strName}</span>
												</div>
												<div class="flex flex-shrink-0 items-center gap-2">
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
												<div class="flex min-w-0 items-center gap-2">
													<Plus
														size={16}
														class="flex-shrink-0 text-green-600 dark:text-green-400"
													/>
													<span class="truncate">{item.strName}</span>
												</div>
												<span class="flex-shrink-0">{item.intCount}</span>
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
												<div class="flex min-w-0 items-center gap-2">
													<Minus size={16} class="flex-shrink-0 text-red-600 dark:text-red-400" />
													<span class="truncate">{item.strName}</span>
												</div>
												<span class="flex-shrink-0">{item.intCount}</span>
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
											<span class="truncate">{item.strName}</span>
											<span class="flex-shrink-0">{item.intCount}</span>
										</div>
									{/each}
								</div>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/each}
		</div>

		{#if scrollToTopVisible}
			<button
				class="fixed bottom-6 right-6 rounded-full bg-gray-800 p-3 text-white shadow-lg transition-all hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
				onclick={scrollToTop}
				title="Scroll to top"
			>
				<ArrowUp size={20} />
			</button>
		{/if}
	{/if}
</div>
