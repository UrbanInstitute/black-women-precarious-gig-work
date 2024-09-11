<!--
  @component
  Search module, utilizing Typeahead from svelte-typeahead (https://github.com/metonym/svelte-typeahead)
 -->
<script>
  import searchData from "$data/tool/occupation-search.json";
  import Typeahead from "svelte-typeahead";
  import { selectedOcc } from "$stores/selected-occ";
  import { selectedComparisonField } from "$stores/selected-dropdowns";
  import { searchValue } from "$stores/search";
  import IconSearch from "./Icons/IconSearch.svelte";
  import IconX from "./Icons/IconX.svelte";
  import { logClickToGA } from "@urbaninstitute/dataviz-components";

  /* let limit = 10 */
  let label = "Search for occupation";
  let placeholder = "Search for occupation";

  const extract = (/** @type {{ occ_name: any; }} */ item) => item.occ_name;

  const handleXClick = () => {
    $searchValue = "";
    $selectedOcc = null;
    // @ts-ignore
    document.querySelector("input[name='search']")?.focus();
  };
</script>

<div class="container">
  <div class="search">
    <Typeahead
      data={searchData}
      bind:value={$searchValue}
      {extract}
      {label}
      hideLabel
      showAllResultsOnFocus
      removeFormAriaAttributes
      {placeholder}
      let:result
      disable={(d) => !d.hasOwnProperty($selectedComparisonField)}
      on:clear={(e) => {
        selectedOcc.set(null);
        logClickToGA(e.target, `tool_search_clear`);
      }}
      on:select={(e) => {
        selectedOcc.set(e.detail.original.occ_id);
        logClickToGA(e.target, `tool_search_select--${e.detail.original.occ_name}`);
      }}
    >
      <p class="text">{@html result.string}</p>
      <p class="subtext">
        <!-- get industry name based on industry id -->
        {@html result.original.occ_ind_name}
      </p>
    </Typeahead>
  </div>
  {#if $selectedOcc}
    <span
      class="icon-container icon-x"
      style:cursor="pointer"
      role="button"
      tabindex="0"
      aria-label="Clear search input"
      on:click={handleXClick}
      on:keypress={handleXClick}><IconX fill="#353535" /></span
    >
  {:else}
    <span class="icon-container icon-search"><IconSearch fill="#353535" /></span>
  {/if}
</div>

<style>
  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .search {
    width: 15.625rem;
    transform: translateY(-1px);
  }

  :global([data-svelte-typeahead] input) {
    color: var(--color-black);
    font-family: var(--font-family-sans);
    min-height: 3.375rem;
    border: none !important;
    text-overflow: ellipsis !important;
    border: 1px solid #d2d2d2 !important;
    /* border: 1px solid var(--color-gray-shade-medium) !important; */
  }
  /* add padding to the right of the input to space from icon */
  :global([data-svelte-typeahead] input) {
    padding-right: 2rem !important;
  }

  :global([data-svelte-typeahead] input::placeholder) {
    color: var(--color-gray-shade-darkest);
  }

  :global([data-svelte-typeahead] mark) {
    background-color: var(--color-gray-shade-lightest) !important;
    color: var(--color-gray-shade-darker);
  }
  :global(.search ul) {
    overflow-y: scroll !important;
    max-height: 500px !important;
  }

  :global([data-svelte-typeahead] li.selected:hover),
  :global([data-svelte-typeahead] li.selected) {
    background-color: var(--color-gray-shade-lightest) !important;
  }
  .text {
    margin: 0;
    font-size: var(--font-size-normal) !important;
    color: var(--color-black) !important;
  }
  .subtext {
    color: var(--color-gray-shade-darker) !important;
    margin: 0;
    font-size: var(--font-size-small) !important;
    font-style: italic;
  }

  .icon-container {
    position: absolute;
    right: var(--spacing-1);
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-x {
    top: var(--spacing-4);
  }

  :global(.icon-container svg) {
    overflow: visible;
  }

  /* remove icons from native search*/
  :global(
      [type="search"]::-webkit-search-decoration,
      [type="search"]::-webkit-search-cancel-button
    ) {
    appearance: none;
  }

  @media (max-width: calc(48rem - 1px)) {
    .container {
      width: 100%;
      max-width: 21.5rem;
    }

    .search {
      width: 100%;
      transform: none;
    }

    :global([data-svelte-typeahead] input) {
      min-height: 3.125rem;
    }

    .icon-search {
      top: var(--spacing-3);
    }

    .icon-x {
      top: 15px;
    }
  }
</style>
