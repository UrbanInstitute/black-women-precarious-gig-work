<!--
  @component
  Dropdowns above tool
 -->
<script>
  // @ts-nocheck
  // import data
  import dropdownData from "$data/tool/dropdowns.json";
  // import stores and utils
  import {
    selectedCharacteristic,
    selectedIdentity,
    selectedComparison
  } from "$stores/selected-dropdowns";
  import { logClickToGA } from "@urbaninstitute/dataviz-components";
  // import components
  import { BasicDropdown } from "@urbaninstitute/dataviz-components";

  // convert data into dropdown-required format
  let dropdownDataObj = Object.keys(dropdownData).reduce((acc, key) => {
    acc[key] = Object.entries(dropdownData[key]["values"]).map(([value, label]) => ({
      value,
      label
    }));
    return acc;
  }, {});
</script>

<div class="container">
  <span>Occupational</span><span>Crowding</span><span>of</span>
  <BasicDropdown
    id="identity"
    inlineLabel={dropdownData.identity.label}
    bind:value={$selectedIdentity}
    data={dropdownDataObj.identity}
    variant="secondary-yellow"
    placeholder={null}
    on:change={(e) =>
      logClickToGA(
        e.target,
        `tool_identity_dropdown_change--${dropdownData.identity.values[$selectedIdentity]}`
      )}
  />
  <span>Black</span><span>Women</span> <span>and</span>
  <BasicDropdown
    id="characteristics"
    bind:value={$selectedCharacteristic}
    inlineLabel={dropdownData.characteristic.label}
    data={dropdownDataObj.characteristic}
    variant="secondary-yellow"
    placeholder={null}
    on:change={(e) =>
      logClickToGA(
        e.target,
        `tool_characteristic_dropdown_change--${dropdownData.characteristic.values[$selectedCharacteristic]}`
      )}
  />

  <span>Compared</span><span>with</span>
  <BasicDropdown
    id="comparison"
    inlineLabel={dropdownData.comparison.label}
    bind:value={$selectedComparison}
    data={dropdownDataObj.comparison}
    variant="secondary-yellow"
    placeholder={null}
    on:change={(e) =>
      logClickToGA(
        e.target,
        `tool_comparison_dropdown_change--${dropdownData.comparison.values[$selectedComparison]}`
      )}
  />
</div>

<style>
  .container {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: var(--spacing-2);
    row-gap: 0.875rem;
    padding-bottom: var(--spacing-4);
  }

  .container span {
    font-size: var(--font-size-2xl);
    font-weight: 400;
    color: var(--color-gray-shade-darkest);
  }

  /* make dropdowns sit inline */
  :global(.container .dropdown-parent) {
    display: inline-block !important;
    padding: 0 !important;
    transform: translateY(-1px) !important;
  }

  /* make width fit to the content of the dropdown */
  :global(.container .dropdown-container) {
    width: fit-content !important;
  }

  /* add padding to the right of dropdown so there's room after "fit-content" as width */
  :global(.container .dropdown-container select) {
    padding-right: var(--spacing-10) !important;
    font-size: var(--font-size-2xl) !important;
    background-color: transparent !important;
    border-color: transparent !important;
    border-bottom: 5px solid var(--color-black) !important;
    padding: 0 !important;
    padding-right: var(--spacing-8) !important;
  }

  :global(.container .dropdown-container .icons) {
    padding-right: var(--spacing-1) !important;
  }

  @media (min-width: 48rem) {
    .container {
      justify-content: center;
      max-width: 60rem;
    }
    :global(.container .dropdown-parent) {
      padding: 0 var(--spacing-2) !important;
    }
    .container span {
      font-size: var(--font-size-3xl);
    }

    :global(.container .dropdown-container select) {
      font-size: var(--font-size-3xl) !important;
    }
  }
</style>
