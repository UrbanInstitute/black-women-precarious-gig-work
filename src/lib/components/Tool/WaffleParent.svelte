<!--
  @component
  Parent component for the waffle chart, crowding text, and tooltip
 -->
<script>
  // @ts-nocheck
  // import data
  import occupationData from "$data/tool/occupations.json";
  import dropdownData from "$data/tool/dropdowns.json";
  // import stores and utils
  import {
    selectedCharacteristic,
    selectedComparisonField,
    selectedIdentity
  } from "$stores/selected-dropdowns";
  import { selectedOcc, selectedOccData, selectedNode } from "$stores/selected-occ";
  import { searchValue } from "$stores/search";
  import { hoveredOccName, hoveredPosition } from "$stores/hovered-occ";
  import { windowIsMobile } from "$stores/window-width";
  import { urbanColors } from "@urbaninstitute/dataviz-components/utils";
  import { resizeFix } from "$utils/resizeFix";
  // import components
  import { LayerCake, Svg } from "layercake";
  import WaffleChart from "./WaffleChart.svelte";
  import { Tooltip } from "@urbaninstitute/dataviz-components";

  // define crowdingLabels and colors
  const crowdingMetadata = [
    {
      label: "Crowded in",
      sentenceCase: "crowded in to",
      shortSentenceCase: "over",
      color: urbanColors.getBlues()[6],
      bgColor: urbanColors.getBlues()[1]
    },
    {
      label: "Proportional",
      sentenceCase: "proportionally represented in",
      shortSentenceCase: "proportionally",
      color: urbanColors.yellow,
      bgColor: urbanColors.getYellows()[0]
    },
    {
      label: "Crowded out",
      sentenceCase: "crowded out of",
      shortSentenceCase: "under",
      color: urbanColors.blue,
      bgColor: urbanColors.getBlues()[0]
    }
  ];

  // node radius
  const inlineRadius = 10;

  // full name of chosen characteristic
  $: characteristic = dropdownData.characteristic.values[$selectedCharacteristic];

  // dynamic waffle chart dimensions
  $: clientWidth = 500;
  $: rowCount = 5;
  $: r = 7;
  $: cellWidth = 19;
  $: cellHeight = 22;

  // reactively update waffle chart dimensions based on clientWidth
  $: {
    // 31 = max number of columns, add one more for padding (then add 1 for spacing)
    cellWidth = clientWidth / 32 + 1;

    // if mobile size, use 6 rows instead of 5
    if (clientWidth < 425 && cellWidth < 16) {
      rowCount = 6;
    } else {
      rowCount = 5;
    }

    // set cellWidth, cellHeight, and node radius
    // clamp cellWidth to a max of 22 and min of 13.5
    cellWidth = Math.min(cellWidth, 22);
    cellWidth = Math.max(cellWidth, 13.5);
    cellHeight = cellWidth * 1.15;
    r = cellWidth / 2 - 2;
  }
</script>

<!-- resizeFix is for drupal race condition that sometimes gives a height of 0 -->
<div class="parent" bind:clientWidth use:resizeFix>
  <!-- for each crowding designation, generate a wafflechart section -->
  {#each crowdingMetadata as obj, i}
    <!-- filter data to the selected comparison and sort by the characteristic flag -->
    {@const data = occupationData
      .filter((d) => d[$selectedComparisonField] === crowdingMetadata.length - i)
      .sort((a, b) => {
        // if flag is undefined, set to 0
        let d = b["flag_" + $selectedCharacteristic] ?? 0;
        let c = a["flag_" + $selectedCharacteristic] ?? 0;

        // if the characteristics are the same, sort by occupation id, else sort by characteristic flag
        if (d === c) {
          b.occ_ind_id - a.occ_ind_id;
        } else {
          return d - c;
        }
      })}

    <!-- get total number of occupations that have this crowding designation -->
    {@const totalOccCount = data.length}

    <!-- get number of occupations that have a flag for the selected characteristic -->
    {@const characteristicCount = data.filter(
      (d) => d["flag_" + $selectedCharacteristic] === 1
    ).length}

    <div class="container">
      <!-- title of the crowding designation -->
      <div class="crowding-title">{obj.label}</div>

      <div class="data-description">
        <!-- characteristic text under wafflechart -->
        <b>{dropdownData.identity.beginningSentenceCaseValues[$selectedIdentity]}</b> Black women
        are {obj.sentenceCase}
        <b>{totalOccCount}</b>
        occupations. <b>{characteristicCount}</b>
        disproportionately {dropdownData.characteristic.prefix[$selectedCharacteristic]}&nbsp;
        <span class="characteristic" style:--bg-color={obj.bgColor}>
          <!-- circle to indicate crowding color/label -->
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
              fill={obj.color}
            />
          </svg>
          {characteristic.toLowerCase()}</span
        >
      </div>

      <!-- parent container of the waffle chart -->
      <div
        class="waffle-container"
        style:height="{cellHeight * rowCount}px"
        role="presentation"
        use:resizeFix
        on:click={(/** @type {{ target: { tagName: string; }; }} */ e) => {
          // if (mouse) click is on the svg (aka within the chart but not the nodes), set selected occupation to null
          if (!$windowIsMobile && e.target.tagName === "svg") {
            $selectedOcc = null;
            $searchValue = "";
          }
        }}
      >
        <!-- setup layercake with custom prop for colors (replaces zGet in order to simplify) -->
        <LayerCake {data} custom={{ color: obj.color, bgColor: obj.bgColor }}>
          <Svg
            label="A waffle chart showing the occupations in which {dropdownData.identity
              .sentenceCaseValues[
              $selectedIdentity
            ]} Black women are {obj.shortSentenceCase} represented, with the jobs that disproportionately {dropdownData.characteristic.prefix[
              $selectedCharacteristic
            ].toLowerCase()} {characteristic.toLowerCase()} highlighted."
          >
            <WaffleChart {rowCount} {r} {cellHeight} {cellWidth} />
          </Svg>
        </LayerCake>
      </div>
    </div>
  {/each}
</div>

<!-- check if there's a selected occupation and that the comparison field exists in the data OR there's a hovered occupation-->
{#if ($selectedOcc && $selectedOccData?.hasOwnProperty($selectedComparisonField)) || $hoveredOccName}
  <!-- if hoveredPosition is set, display hover version of the tooltip -->
  {#if $hoveredPosition.x}
    <Tooltip
      x={$hoveredPosition.x}
      y={$hoveredPosition.y}
      containParent
      style="dark"
      size={$hoveredOccName?.length || 30 > 50 ? "large" : "small"}
      borderColor={urbanColors.black}
      boxShadow={true}
    >
      {$hoveredOccName}
    </Tooltip>
    <!-- if hoveredPosition is not set, display selected node version of the tooltip -->
  {:else if $selectedOcc}
    <Tooltip
      el={$selectedNode}
      containParent
      style="dark"
      size={$selectedOccData?.occ_name.length || 30 > 50 ? "large" : "small"}
      borderColor={urbanColors.black}
      boxShadow={true}
    >
      {$selectedOccData?.occ_name}
    </Tooltip>
  {/if}
{/if}

<style>
  .parent {
    display: flex;
    flex-direction: column;
    margin-right: var(--spacing-5);
  }

  .container {
    margin-bottom: var(--spacing-8);
  }

  .crowding-title {
    color: var(--color-gray-shade-darker);
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-light);
    line-height: 137.5%; /* 2.57813rem */
    text-transform: uppercase;
  }

  .data-description {
    margin-bottom: var(--spacing-2);
    font-size: var(--font-size-small);
  }

  .waffle-container {
    width: 100%;
    height: 7.5rem;
    margin-bottom: var(--spacing-2);
  }

  .characteristic {
    background-color: var(--bg-color);
    padding: var(--spacing-1) var(--spacing-2);
    display: inline-block;
  }

  .characteristic svg {
    margin-right: var(--spacing-1);
  }

  :global(.tooltip) {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.22) !important;
  }

  @media (max-width: calc(48rem - 1px)) {
    .parent {
      margin: 0 var(--spacing-5);
    }
  }
</style>
