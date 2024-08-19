<script>
  // import stores and utils
  import { selectedComparisonField } from "$stores/selected-dropdowns";
  import { selectedOcc, selectedOccData } from "$stores/selected-occ";
  import { searchValue } from "$stores/search";
  import { windowWidth, windowIsMobile } from "$stores/window-width";
  import { pymChildStore } from "@urbaninstitute/dataviz-components/stores";
  import { logClickToGA } from "@urbaninstitute/dataviz-components";
  // import components
  import Sidebar from "$components/Tool/Sidebar.svelte";
  import Search from "$components/Tool/Search.svelte";
  import WaffleParent from "$components/Tool/WaffleParent.svelte";
  import Dropdowns from "$components/Tool/Dropdowns.svelte";

  // KEY FUNCTIONALITY: clear selected occupation if the selected comparison field is not available
  $: {
    if ($selectedOcc && !$selectedOccData?.hasOwnProperty($selectedComparisonField)) {
      $selectedOcc = null;
      $searchValue = "";
    }
  }
</script>

<svelte:window bind:innerWidth={$windowWidth} />
<main>
  <div class="dropdowns">
    <Dropdowns />
  </div>

  <div class="container" class:bordered={!$windowIsMobile}>
    <div class="chart">
      <div class="search">
        <Search />
        {#if $selectedOcc && $windowIsMobile}
          <span
            class="view-more-search"
            role="link"
            on:click={(e) => {
              let topPos =
                document.getElementById("sidebar").getBoundingClientRect().top + window.scrollY;
              if (topPos) {
                $pymChildStore.scrollParentToChildPos(topPos - 70);
                logClickToGA(e.target, "tool_view_selected_metrics_below");
              }
            }}>View selected metrics below</span
          >
        {/if}
      </div>
      <WaffleParent />
    </div>
    <Sidebar />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
  }

  main {
    max-width: 73.125rem;
    margin: 0 auto;
  }

  .dropdowns {
    display: flex;
    gap: var(--spacing-8);
    padding: var(--spacing-6) var(--spacing-5);
    justify-content: center;
  }

  .container {
    display: flex;
    flex-direction: row;
    margin-left: var(--spacing-5);
  }

  .bordered {
    border-top: 1px solid #d2d2d2;
  }

  .chart {
    width: 50.1875rem;
    display: flex;
    flex-direction: column;
  }

  .search {
    display: flex;
    justify-content: end;
  }

  .view-more-search {
    font-weight: var(--font-weight-normal) !important;
    font-style: italic;
    text-decoration: underline !important;
    color: var(--color-gray-shade-darker) !important;
    margin-top: var(--spacing-4);
    cursor: pointer;
  }

  @media (max-width: calc(48rem - 1px)) {
    .container {
      flex-direction: column;
      margin-left: 0;
    }

    .chart {
      width: 100%;
    }

    .dropdowns {
      display: block;
      gap: inherit;
      padding: inherit;
      background-color: var(--color-gray-shade-lighter);
      padding-bottom: var(--spacing-4);
      padding: var(--spacing-5) var(--spacing-5) var(--spacing-4) var(--spacing-5);
      justify-content: none;
    }

    .search {
      background-color: var(--color-gray-shade-lighter);
      padding: 0 var(--spacing-5) var(--spacing-5) var(--spacing-5);
      justify-content: center;
      width: 100%;
      margin-bottom: var(--spacing-6);
      flex-direction: column;
      align-items: center;
    }
  }
</style>
