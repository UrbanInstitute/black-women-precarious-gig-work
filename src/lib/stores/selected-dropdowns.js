import { writable, derived } from "svelte/store";
/**
 * @type {import("svelte/store").Writable<string>}
 */
export const selectedCharacteristic = writable("temp");

/**
 * @type {import("svelte/store").Writable<string>}
 */
export const selectedIdentity = writable("all");

/**
 * @type {import("svelte/store").Writable<string>}
 */
export const selectedComparison = writable("wm");

// comparison field based on dropdowns
export const selectedComparisonField = derived(
  [selectedIdentity, selectedComparison],
  ([$selectedIdentity, $selectedComparison]) => {
    // combine crowding field name based on selected identity and comparison group
    return "c_" + $selectedIdentity + "_" + $selectedComparison;
  }
);
