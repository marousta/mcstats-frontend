import { MD5 } from 'crypto-js';

// From https://jsfiddle.net/sUK45/
export default function (str: string) {
	const offset = 5;
	return (
		'#' +
		MD5(str)
			.toString()
			.slice(offset, offset + 6)
	);
}
