<script lang="ts">
	import { Label, Input, Button, Accordion, AccordionItem } from 'flowbite-svelte';
	import axios from 'axios';

	let username: string = $state('');
	let accounts: Account[] = $state([]);

	$effect(() => {
		console.log('accounts', accounts);
	});

	type Account = {
		username: string;
		ccid: number;
		inventory: Item[];
	};

	type Item = {
		bCoins: boolean;
		bUpgrade: boolean;
		intCharId: number; // same as ccid
		intCount: number;
		sortOrder: number;
		strName: string;
		strType: string;
	};

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		console.log('username', username);

		try {
			const resp = await axios.post('/api/get-char', { username });
			console.log('resp', resp);

			if (!accounts.find((acc) => acc.username === username)) {
				accounts = [
					...accounts,
					{ username, ccid: resp.data.ccid, inventory: resp.data.inventory }
				];
			} else {
				accounts = accounts.map((acc) => {
					if (acc.username === username) {
						return { username, ccid: resp.data.ccid, inventory: resp.data.inventory };
					}
					return acc;
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center p-4">
	<form onsubmit={handleSubmit} class="w-1/2 p-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class="flex-grow">
				<Label for="username-input" class="mb-2">Username</Label>
				<Input id="username-input" bind:value={username} required />
			</div>
			<div>
				<Button type="submit" color="dark">Submit</Button>
			</div>
		</div>
	</form>

	{#if accounts.length > 0}
		{#each accounts as account}
			<div class="w-1/2 p-4">
				<Accordion>
					{#each Object.entries(account.inventory.reduce((acc, item) => {
							if (!acc[item.strType]) acc[item.strType] = [];
							acc[item.strType].push(item);
							return acc;
						}, {})) as [category, items]}
						<AccordionItem>
							<svelte:fragment slot="header">
								{category} ({items.length} items)
							</svelte:fragment>
							<Accordion>
								{#each items as item}
									<AccordionItem>
										<svelte:fragment slot="header">
											{item.strName}
										</svelte:fragment>
										<div class="flex flex-col gap-4 p-4">
											<div>Count: {item.intCount}</div>
											<div>Sort Order: {item.sortOrder}</div>
											<div>Character ID: {item.intCharId}</div>
											<div>BCoins: {item.bCoins ? 'Yes' : 'No'}</div>
											<div>Upgrade: {item.bUpgrade ? 'Yes' : 'No'}</div>
										</div>
									</AccordionItem>
								{/each}
							</Accordion>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>
		{/each}
	{/if}
</div>
