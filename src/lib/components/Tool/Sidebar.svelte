<!--
  @component
  Sidebar containing all metrics related to an individual occupation
 -->
<script>
  // @ts-nocheck
  // import data
  import dropdownData from "$data/tool/dropdowns.json";
  // import stores and utils
  import { selectedOcc, selectedOccData, selectedOccCrowding } from "$stores/selected-occ";
  import { selectedIdentity } from "$stores/selected-dropdowns";
  import { searchValue } from "$stores/search";
  import { windowIsMobile } from "$stores/window-width";
  import { pymChildStore } from "@urbaninstitute/dataviz-components/stores";
  import { format } from "d3-format";
  import { getCrowdingColor, getCrowdingLabel } from "$utils/helper";
  import { logClickToGA } from "@urbaninstitute/dataviz-components";

  // crowding color for the selected occupation
  $: crowdingColor = getCrowdingColor($selectedOccCrowding) ?? "var(--color-gray-shade-lightest)";

  // node radius
  const inlineRadius = 11;

  // define sidebar metrics data, dynamically creating field name based on dropdown/store data
  $: data = [
    {
      label: "Overall median wage",
      field: "occ_median",
      format: "$,.0f"
    },
    {
      // @ts-ignore
      label: `${dropdownData.identity.beginningSentenceCaseValues[$selectedIdentity]} Black women`,
      field: "perc_" + $selectedIdentity,
      format: ".1%"
    },
    {
      // @ts-ignore
      label: `Median wage income of ${dropdownData.identity.sentenceCaseValues[$selectedIdentity]} Black women`,
      field: "wage_" + $selectedIdentity,
      format: "$,.0f"
    },
    {
      label: "Temporary workers",
      field: "perc_temp",
      format: ".1%"
    },
    {
      label: "Independent contractors",
      field: "perc_indie",
      format: ".1%"
    },
    {
      label: "Contract workers",
      field: "perc_contract",
      format: ".1%"
    },
    {
      label: "Part-time workers",
      field: "perc_parttime",
      format: ".1%"
    },
    {
      label: "Retirement coverage",
      field: "perc_retirement",
      format: ".1%"
    },
    {
      label: "Health insurance coverage",
      field: "perc_health",
      format: ".1%"
    }
  ];
</script>

<div
  class="sidebar-container"
  id="sidebar"
  class:bordered={!$windowIsMobile}
  style:--border-color={crowdingColor}
>
  {#if $selectedOcc && $selectedOccData}
    <!-- title -->
    <h4>{$selectedOccData?.occ_name}</h4>
    <!-- mobile only: crowding label with node color -->
    {#if $windowIsMobile && getCrowdingColor($selectedOccCrowding)}
      <div class="subtitle">
        <svg
          width={inlineRadius}
          height={inlineRadius}
          overflow="visible"
          aria-hidden="true"
          role="presentation"
        >
          <circle
            cx={inlineRadius / 2}
            cy={inlineRadius / 2}
            r={inlineRadius / 2}
            fill={getCrowdingColor($selectedOccCrowding)}
          />
        </svg>
        <span>{getCrowdingLabel($selectedOccCrowding)}</span>
      </div>
    {/if}

    <div class="metrics-table">
      <!-- iterate through sidebar data and display accordingly -->
      {#each data as d}
        <div class="row">
          <span class="label">{d.label}</span>
          <span class="value">
            <!-- if field exists and is not NA/null, show and format -->
            {#if $selectedOccData[d.field] && $selectedOccData[d.field] !== "NA" && $selectedOccData[d.field] !== null}
              {format(d.format)($selectedOccData[d.field])}
            {:else}
              <!-- else if NA, show NA -->
              n/a
            {/if}</span
          >
        </div>
      {/each}
    </div>
    <div style="display: flex; justify-content: center;">
      <button
        tabindex="0"
        class="clear-selection-label"
        on:click={(e) => {
          // reset searchbox value and selected occupation
          $searchValue = "";
          $selectedOcc = null;
          // @ts-ignore
          logClickToGA(e.target, `tool_sidebar_clear`);
          // if on mobile, scroll back to top
          if ($windowIsMobile) $pymChildStore.scrollParentTo("tool");
        }}
      >
        Clear selection
      </button>
    </div>
  {:else}
    <!-- when no occupation is selected, show select info -->
    <div class="no-data">
      Select or search for an occupation to see more information about its work characteristics.
    </div>
  {/if}
</div>

<style>
  .sidebar-container {
    width: 100%;
    max-width: 22.9375rem;
    min-height: 40rem;
    height: fit-content;
    background-color: var(--color-gray-shade-lightest);
    padding: var(--spacing-9);
    scroll-margin-top: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .sidebar-container .subtitle {
    margin: var(--spacing-1) 0;
    font-style: italic;
    font-size: var(--font-size-small);
  }

  .sidebar-container .subtitle span {
    margin-left: 0.3125rem;
  }

  .sidebar-container h4 {
    margin: var(--spacing-4) 0 var(--spacing-8) 0;
    font-size: var(--font-size-2xl);
    line-height: 125%;
  }

  .bordered {
    border-left: 9px solid var(--border-color);
  }

  .metrics-table {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin: var(--spacing-4) 0;
  }

  .metrics-table .row {
    display: flex;
    /* place values at vertical bottom of row */
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-gray-shade-light);
    padding-bottom: var(--spacing-3);
    gap: var(--spacing-2);
  }

  .metrics-table .row .label {
    font-weight: bold;
    font-size: var(--font-size-normal);
  }

  .metrics-table .row .value {
    font-size: var(--font-size-normal);
    color: var(--color-gray-shade-darkest);
  }

  .clear-selection-label {
    all: unset;
    color: var(--color-black);
    font-style: italic;
    font-size: var(--font-size-normal);
    text-decoration: underline;
    text-underline-offset: var(--spacing-1);
    margin-top: var(--spacing-2);
    display: flex;
    cursor: pointer;
  }

  .clear-selection-label:focus {
    outline: auto;
  }

  .no-data {
    display: flex;
    font-size: var(--font-size-xl);
    align-items: center;
    justify-content: center;
    font-style: italic;
    height: 100%;
    line-height: 162.5%;
    color: var(--color-gray-shade-darkest);
  }

  @media (max-width: calc(56.5rem - 1px)) {
    .sidebar-container {
      padding: var(--spacing-6);
      max-width: 18.8375rem;
    }
  }

  @media (max-width: calc(48rem - 1px)) {
    .sidebar-container {
      background-color: inherit;
      max-width: none;
      width: 100%;
      padding: 0 var(--spacing-5);
      margin-bottom: var(--spacing-10);
      margin-top: var(--spacing-4);
      min-height: fit-content;
    }

    .sidebar-container h4 {
      margin: 0;
    }

    .metrics-table {
      /* increase spacing from h4 on mobile */
      margin-top: var(--spacing-8);
    }
  }
</style>
