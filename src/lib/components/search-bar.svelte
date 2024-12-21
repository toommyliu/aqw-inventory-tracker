<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import { store } from '$lib/shared.svelte';

	import axios from 'axios';
	import { toast } from 'svelte-sonner';
	import { trackInventory } from '@/track-inventory';

	let username = $state<string>('');

	async function onsubmit(ev: SubmitEvent) {
		ev.preventDefault();

		try {
			const resp = await axios.post('/api/get-char', { username });
			trackInventory(username, resp.data.inventory);
		} catch (error) {
			console.error(error);
			toast.error('An error occured (1).');
		}
	}
</script>

<div class="container flex justify-center p-16">
	<form
		class="flex w-[50%] flex-row items-center justify-center gap-2"
		onsubmit={async (ev) => await onsubmit(ev)}
	>
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
