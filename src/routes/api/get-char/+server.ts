// import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import axios from 'axios';

const charIdMap: Map<string, number> = new Map();

export const POST: RequestHandler = async ({ request }) => {
	const { username } = await request.json();
	if (!username) error(400, 'No username provided');

	const resp = await axios.get(`https://account.aq.com/CharPage?id=${username}`);
	const html = resp.data;

	if (html.includes('Not Found')) error(404, 'Character not found');

	const match = html.match(/var ccid = (\d+);/);
	const ccidStr = match ? match[1] : null;

	if (!ccidStr) error(404, 'Character not found');

	const ccid = Number.parseInt(ccidStr, 10);
	if (!charIdMap.has(username)) charIdMap.set(username, ccid);

	let inventory: unknown[] = [];

	try {
		const resp = await axios.get(`https://account.aq.com/CharPage/Inventory?ccid=${ccid}`);
		inventory = resp.data;
	} catch {
		inventory = [];
	}

	return json({ ccid, username, inventory });
};
