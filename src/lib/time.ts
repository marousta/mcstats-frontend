export class getTime {
	private readonly time: number;
	private readonly d: Date;
	private readonly months: Array<string>;
	private readonly date: any;
	private readonly format: any;

	constructor(date: number | string | Date = new Date()) {
		if (date === undefined) {
			throw new Error('undefined value date');
		}

		switch (typeof date) {
			case 'number':
				this.time = date;
				this.d = new Date(date * 1000);
				break;
			case 'string':
				const d = new Date(date);
				this.time = Math.floor(d.getTime() / 1000);
				this.d = d;
				break;
			case 'object':
				this.time = Math.floor(date.getTime() / 1000);
				this.d = date;
				break;
		}

		this.months = [
			'January',
			'Febuary',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
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
				return (
					(this.date.hh == 0 ? '12' : meridiem) +
					':' +
					(this.date.mm < 10 ? '0' + this.date.mm : this.date.mm)
				);
			},
			meridiem: () => {
				return this.date.hh > 12 ? 'pm' : this.date.hh == 0 ? 'pm' : 'am';
			},
		};
	}

	full() {
		return (
			this.date.d +
			' ' +
			this.months[this.date.m] +
			' ' +
			this.date.y +
			' - ' +
			this.format.time() +
			this.format.meridiem()
		);
	}

	lite() {
		return this.date.d + ' ' + this.months[this.date.m] + ' ' + this.date.y;
	}

	half() {
		return this.format.time() + this.format.meridiem();
	}

	logtime() {
		let t = {
			ss: Math.floor(this.time % 60),
			mm: Math.floor((this.time / 60) % 60),
			hh: Math.floor((this.time / 60 / 60) % 24),
			d: Math.floor(this.time / 60 / 60 / 24),
		};

		let ret = '';
		t.d ? (ret += t.d + (t.d > 1 ? ' days ' : ' day ')) : 0;
		t.hh ? (ret += t.hh + 'h ') : 0;
		t.mm ? (ret += (t.mm < 10 ? '0' + t.mm : t.mm) + 'm ') : 0;
		t.ss ? (ret += (t.ss < 10 ? '0' + t.ss : t.ss) + 's') : 0;

		if (ret == '') {
			ret = '00s';
		}
		return ret;
	}

	timestamp() {
		return this.time;
	}
}
