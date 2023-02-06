import { ServerKind } from '../../../stores/websocket/types';
import { error } from '@sveltejs/kit';

export const load = async ({ params }: { params: { kind: ServerKind } }) => {
	const kind = params.kind;

	if (!Object.values(ServerKind).includes(kind)) {
		throw error(404, {
			message: 'Not found',
		});
	}
};
