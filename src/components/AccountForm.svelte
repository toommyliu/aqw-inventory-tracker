<!-- <script lang="ts">
	import { Label, Input, Button, Accordion } from 'flowbite-svelte';
	import axios from 'axios';

	let username: string = $state('');
	let data = $state({});

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		console.log('username', username);

		try {
			const resp = await fetch(`https://account.aq.com/CharPage?id=${username}`, {
				method: 'GET'
			});
			console.log(resp);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<form onsubmit={handleSubmit} class="mb-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div class="flex-grow">
			<Label for="username-input" class="mb-2">Username</Label>
			<Input id="username-input" bind:value={username} required />
		</div>
		<div>
			<Button type="submit" color="dark">Submit</Button>
		</div>
	</div>
</form> -->
