import type { ParamMatcher } from '@sveltejs/kit';
import { ServerKind } from '../stores/websocket/types';

export const match = ((param) => {
	return Object.values(ServerKind).includes(param as any);
}) satisfies ParamMatcher;
