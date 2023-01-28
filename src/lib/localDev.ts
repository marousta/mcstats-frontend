const localhost: Array<string> = ['localhost', '127.0.0.1'];

function strncmp(str1: string, str2: string, n: number): number {
	str1 = str1.substring(0, n);
	str2 = str2.substring(0, n);
	return str1 == str2 ? 0 : str1 > str2 ? 1 : -1;
}

export function checkLocalDev(devpath: string, prodpath: string) {
	if (
		localhost.includes(window.location.hostname) ||
		strncmp(window.location.hostname, '192.168.', 8) == 0
	) {
		return devpath;
	} else {
		return prodpath;
	}
}
