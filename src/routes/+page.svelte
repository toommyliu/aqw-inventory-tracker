<script lang="ts">
	import { Label, Input, Button, Accordion, AccordionItem } from 'flowbite-svelte';
	import axios from 'axios';

	let username: string = $state('');
	let ccid: number = $state();

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		console.log('username', username);

		try {
			const resp = await axios.post('/api/get-char', { username });
			if (resp?.data?.ccid) {
				ccid = resp.data.ccid;
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

	{#if ccid}
		<div class="w-1/2">
			<Accordion>
				<AccordionItem>
					<span slot="header">{username}</span>
					<p class="mb-2 text-gray-500 dark:text-gray-400">{ccid}</p>
				</AccordionItem>
			</Accordion>
		</div>
	{/if}
</div>
