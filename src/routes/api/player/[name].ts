export async function get({ params }) {
	const url = `https://playerdb.co/api/player/minecraft/${params.name}`;
	const res = await fetch(url);
	const data = await res.json();

	if (data) {
		return {
			body: data
		};
	}

	return {
		status: 404
	};
}
