<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';

	import axios, { AxiosError } from 'axios';
	import { toast } from 'svelte-sonner';
	import { trackInventory } from '@/track-inventory';

	let username = $state<string>('');
	let isLoading = $state<boolean>(false);

	async function onsubmit(ev: SubmitEvent) {
		isLoading = true;

		ev.preventDefault();

		try {
			const resp = await axios.post('/api/get-char', { username });
			trackInventory(username, resp.data.inventory);
		} catch (error) {
			const err = error as Error;
			if (
				err instanceof AxiosError &&
				err?.response?.statusText === 'Not Found' &&
				err.response?.status === 404
			) {
				toast.error('Account not found.');
				return;
			}

			toast.error('An error occured (1).');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container m-0 flex flex-col items-center justify-center p-16 pb-4">
	<form
		class="m-0 flex w-full max-w-lg flex-row items-center justify-center gap-2"
		onsubmit={async (ev) => await onsubmit(ev)}
	>
		<Input
			type="text"
			placeholder="Your account username..."
			required
			class="input input-bordered w-full"
			onchange={(ev) => (username = ev.currentTarget.value)}
			disabled={isLoading}
		/>
		<Button type="submit" disabled={isLoading} class="min-w-24">
			{isLoading ? 'Loading...' : 'Search'}
		</Button>
	</form>
	{#if isLoading}
		<div class="mt-4 flex items-center justify-center">
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			Loading
		</div>
	{/if}
</div>
