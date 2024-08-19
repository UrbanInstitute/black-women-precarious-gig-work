import { derived, writable } from "svelte/store";
import occupationData from "$data/tool/occupations.json";
import { selectedComparisonField } from "./selected-dropdowns";

// id of the selected occupation
/**
 * @type {import("svelte/store").Writable<number|null>}
 */
export const selectedOcc = writable(null);

// derived store that returns the full occupation data for the selected occupation
export const selectedOccData = derived(selectedOcc, ($selectedOcc) => {
  return occupationData.find((d) => d.occ_id === $selectedOcc);
});

// the crowding value for the selected occupation (based on dropdowns)
export const selectedOccCrowding = derived(
  [selectedOccData, selectedComparisonField],
  ([$selectedOccData, $selectedComparisonField]) => {
    // if there's no selected occupation, return null
    if ($selectedOccData === undefined) return null;

    let field = $selectedComparisonField;

    // if the field exists in the selected occupation data, return it
    if ($selectedOccData.hasOwnProperty(field)) {
      // @ts-ignore
      return $selectedOccData[field] ?? null;
    } else {
      return null;
    }
  }
);

// selected node in WaffleChart component
/**
 * @type {import("svelte/store").Writable<SVGCircleElement|null>}
 */
export const selectedNode = writable(null);
