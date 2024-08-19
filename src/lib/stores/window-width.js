import { writable, derived } from "svelte/store";
/**
 * @type {import("svelte/store").Writable<number>}
 */
export const windowWidth = writable(0);
export const windowIsMobile = derived(windowWidth, ($windowWidth) => $windowWidth < 768);
