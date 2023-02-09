import type { ParamMatcher } from '@sveltejs/kit';

import { ServerKind } from '../types/global';

export const match = ((param) => {
	return Object.values(ServerKind).includes(param as any);
}) satisfies ParamMatcher;
