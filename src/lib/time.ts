export default class getTime {
	time:	number;
	d: 		Date;
	months:	Array<string>;
	date:	any;
	format:	any;

	constructor (timestamp: number)
	{
		if (timestamp === undefined) {
			throw new Error("undefined value timestamp");
		}
		this.time = timestamp;
		this.d = new Date(timestamp * 1000);
		this.months = [
			"January",
			"Febuary",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		this.date = {
			y: this.d.getFullYear(),
			m: this.d.getMonth(),
			d: this.d.getDate(),
			hh: this.d.getHours(),
			mm: this.d.getMinutes(),
		};
		this.format = {
			time: () => {
				let meridiem = Math.floor(this.date.hh % 12);
				if (meridiem === 0) {
					meridiem = 12;
				}
				return (this.date.hh == 0 ? "12" : meridiem) + ":" + (this.date.mm < 10 ? "0" + this.date.mm : this.date.mm);
			},
			meridiem: () => {
				return (this.date.hh > 12 ? "pm" : (this.date.hh == 0 ? "pm" : "am"));
			}
		};
	}

	full()
	{
		return this.date.d + " " + this.months[this.date.m] + " " + this.date.y + " - " + this.format.time() + this.format.meridiem();
	}

	lite()
	{
		return this.date.d + " " + this.months[this.date.m] + " " + this.date.y;
	}

	half()
	{
		return this.format.time() + this.format.meridiem();
	}

	logtime()
	{
		let t = {
			ss: Math.floor(this.time % 60),
			mm: Math.floor(this.time / 60 % 60),
			hh: Math.floor(this.time / 60 / 60 % 24),
			d: Math.floor(this.time / 60 / 60 / 24),
		};

		let ret = "";
		t.d ? ret += t.d + (t.d > 1 ? " days " : " day ") : 0;
		t.hh ? ret += t.hh + "h " : 0;
		t.mm ? ret += (t.mm < 10 ? "0" + t.mm : t.mm) + "m " : 0;
		t.ss ? ret += (t.ss < 10 ? "0" + t.ss : t.ss) + "s": 0;

		if (ret == "") {
			ret = "00s";
		}
		return ret;
	}
}
