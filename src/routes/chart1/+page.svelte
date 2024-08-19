<script>
  import ridgePlotDropdownData from "$data/chart1/dropdown.json";
  import "@urbaninstitute/dataviz-components/style"; // import normalize and typography
  import { BasicDropdown, logClickToGA } from "@urbaninstitute/dataviz-components";
  import RidgePlot from "$components/RidgePlot/RidgePlot.svelte";

  /**
   * @type {string | null}
   */
  $: dropdownValue = null;

  const dropdownData = ridgePlotDropdownData
    .map((d) => {
      return { value: String(d.occ), label: d.occ_string };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  // get dropdown label (occupation group name)
  $: dropdownLabel = dropdownData.filter((d) => d.value === dropdownValue)[0]?.label;
</script>

<main>
  <div class="container">
    <BasicDropdown
      id="industry-group-dropdown"
      dropdownWidth={260}
      bind:value={dropdownValue}
      showLabel
      inlineLabel="Occupation group"
      placeholder="All Occupation Groups"
      data={dropdownData}
      on:change={(e) => logClickToGA(e.target, "chart1_industry_dropdown_change")}
    />
  </div>
  <div style:position="relative" style:padding-top="var(--spacing-4)">
    <RidgePlot industryFilter={dropdownValue} industryName={dropdownLabel} />
  </div>
</main>

<style>
  main {
    height: 41.5rem;
  }

  .container {
    padding-bottom: var(--spacing-8);
    padding-left: var(--spacing-1);
  }
</style>
