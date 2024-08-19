import { writable } from "svelte/store";

/**
 * Store for the name of the hovered occupation.
 * @type {import("svelte/store").Writable<string|null>}
 */
export const hoveredOccName = writable(null);

/**
 * Store for the position of the hover.
 * @type {import("svelte/store").Writable<{ x: number | null, y: number | null }>}
 */
export const hoveredPosition = writable({ x: 0, y: 0 });
