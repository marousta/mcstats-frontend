import { PUBLIC_BLUEMAP_URL, PUBLIC_DYNMAP_URL } from '$env/static/public';

import { ServerKind } from '../../types/global';

export interface HamburgerItem {
	name: string;
	href: string;
	new_tab: boolean;
}

export interface HamburgerItems {
	[ServerKind.Vanilla]: HamburgerItem[];
	[ServerKind.Modded]: HamburgerItem[];
}

export const items: HamburgerItems = {
	[ServerKind.Vanilla]: [
		{ name: 'Home', href: `/${[ServerKind.Vanilla]}`, new_tab: false },
		{ name: 'Graphs', href: `/${[ServerKind.Vanilla]}/graphs`, new_tab: false },
		{ name: 'Dynmap', href: `/map/`, new_tab: true },
		{ name: 'Explore', href: `/3dmap/`, new_tab: true },
		{ name: 'About', href: `/about`, new_tab: false },
	],
	[ServerKind.Modded]: [
		{ name: 'Home', href: `/${[ServerKind.Modded]}`, new_tab: false },
		{ name: 'Graphs', href: `/${[ServerKind.Modded]}/graphs`, new_tab: false },
		{ name: 'About', href: `/about`, new_tab: false },
	],
};
