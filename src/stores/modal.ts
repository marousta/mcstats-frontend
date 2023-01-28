import { writable, type Writable } from 'svelte/store';

export enum ModalType {
	Helper,
	Success,
	Warning,
	Error,
}

export type ModalData = {
	id: number;
	type: ModalType;
	message: String;
};

let nextModalID: number = 0;
export function generateID(): number {
	return nextModalID++;
}

export const modals: Writable<ModalData[]> = writable([]);
