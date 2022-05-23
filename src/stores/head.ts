export const fetchPlayer = async (name: string): Promise<JSON> => {
	if (import.meta.env.VITE_FETCH_PLAYER_HEADS == 0) {
		throw 'Player heads are deactivated (VITE_FETCH_PLAYER_HEADS == 0)';
	}
	const url = `${window.location.origin}/api/player/${name}`;
	const res = await fetch(url);
	const data = await res.json();

	if (data.success) {
		return data;
	}
	throw 'Could not load player';
};

export const fetchPlayerSkin = async (name: string): Promise<string> => {
	const player = await fetchPlayer(name);
	if (player) {
		return player.data.player.avatar;
	}
};
