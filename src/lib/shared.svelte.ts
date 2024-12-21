import type { AccountData } from './types';

export const store = $state<GlobalState>({
	accounts: {},
	isLoading: {}
});

type GlobalState = {
	accounts: Record<string, AccountData>;
	isLoading: Record<string, boolean>;
};
