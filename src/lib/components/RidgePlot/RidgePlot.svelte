<!--
  @component
  Parent for ridgeplot
 -->
<script>
  // import data
  import ridgePlotData from "$data/chart1/data.json";
  // import utilities
  import { density1d } from "fast-kde";
  import { LayerCake, Svg, Html } from "layercake";
  import { median } from "d3-array";
  import { urbanColors } from "@urbaninstitute/dataviz-components/utils";
  import { writable } from "svelte/store";
  import { format } from "d3-format";
  import { resizeFix } from "$utils/resizeFix";
  // import components
  import Annotations from "./Annotations.html.svelte";
  import Area from "./Area.svelte";
  import Arrow from "./Arrow.svelte";
  import Arrowhead from "./Arrowhead.svelte";
  import AxisX from "./AxisX.svelte";
  import DensityCurve from "./DensityCurve.svelte";
  import GroupText from "./GroupText.svelte";
  import MedianLine from "./MedianLine.svelte";
  import BaseLine from "./BaseLine.svelte";
  import { Tooltip, LogoUrbanWide } from "@urbaninstitute/dataviz-components";

  /** @type {string | null} */
  export let industryFilter = null;

  /** @type {string | null} */
  export let industryName = null;

  /** @type {import('svelte/store').Writable<null>} */
  const medianValue = writable(null);

  /**
   * @type {number}
   */
  let dynamicX;
  /**
   * @type {number}
   */
  let dynamicY;

  /**
   * @typedef {Object | null} tooltipData
   * @property {number} median - The median wage.
   * @property {number} n - The number of occupations in the selected occupation group
   * @type {{ median: number; n: number; } | null}
   */
  let tooltipData;

  // handle mousemove
  // @ts-ignore
  const handleMouseMove = (e, d) => {
    dynamicX = e.detail.e.pageX;
    dynamicY = e.detail.e.pageY;
    tooltipData = { median: d.median, n: d.n };
  };

  const handleMouseOut = () => {
    tooltipData = null;
  };

  // handle lowercase transformation for "White women" labels
  const handleGroupLabel = (/** @type {string} */ x) => {
    const words = x.split(" ");
    if (words.length > 0 && words[0].toLowerCase() === "white") {
      words[0] = words[0].toLowerCase();
    }
    return words.join(" ");
  };

  /** @type {number | null} */
  $: medianValueBW = null;

  const groups = [
    { id: 1, label: "Black women", color: urbanColors.blue },
    { id: 2, label: "White women", color: urbanColors.yellow },
    { id: 3, label: "Black men", color: urbanColors.gray },
    { id: 4, label: "White men", color: urbanColors.black }
  ];

  // iterate through groups to prep the density data
  $: allData = groups.map((d) => {
    // filter to the group
    let filteredData = ridgePlotData.filter((e) => e.group_factor === d.id);
    // if there's an industry filter, filter to that
    if (industryFilter) {
      filteredData = filteredData.filter((e) => e.occ_broad === Number(industryFilter));
    }

    // get the median value and set the median value for BW (annotation)
    $medianValue = median(filteredData, (d) => d.med_inc_grp);
    if (d.id === 1) {
      medianValueBW = $medianValue;
    }

    // create the density curve (fast-kde)
    const densityData = density1d(filteredData, {
      x: "med_inc_grp",
      bandwidth: 5000,
      bins: 100,
      extent: [0, 140000]
    });

    // put together the output object
    const output = {
      ...d,
      data: Array.from(densityData),
      median: $medianValue,
      n: filteredData.length
    };
    return output;
  });

  $: clientWidth = 550;
  // @ts-ignore
  $: annotations = [];
  const arrow = {
    clockwise: false, // true or false, defaults to true
    source: {
      anchor: "left-bottom", // can be `{left, middle, right},{top-middle-bottom}`
      dx: -5,
      dy: -15
    },
    target: {
      x: "26.5%",
      y: "2%"
    }
  };
  // The median wage across all occupation groups for Black women is $XX,XXX.
  $: {
    // define annotations
    annotations = [
      {
        text:
          clientWidth < 610
            ? `The median wage across all`
            : `The median wage across all occupation`,
        top: "-20%",
        left: "40%",
        arrows: [arrow]
      },
      {
        text:
          clientWidth < 610
            ? `occupation groups for`
            : `groups for Black women is ${format("$,.0f")(medianValueBW)}.`,
        top: "0%",
        left: "40%"
      }
    ];

    if (clientWidth < 610) {
      annotations = [
        ...annotations,
        {
          text: `Black women is ${format("$,.0f")(medianValueBW)}.`,
          top: "20%",
          left: "40%"
        }
      ];
    }

    if (clientWidth <= 475) {
      annotations = [
        {
          text: `The median wage across all occupation groups for Black women is ${format("$.3s")(medianValueBW)}.`,
          top: "-30%",
          left: "35%"
        }
      ];
    }
  }
</script>

<div class="chart-container" bind:clientWidth use:resizeFix>
  {#each allData as d}
    <LayerCake
      padding={{ top: 5, right: clientWidth < 510 ? 2 : 25, bottom: 5, left: 125 }}
      x={"x"}
      y={"y"}
      yDomain={[0, null]}
      data={d.data}
      custom={{ median: d.median }}
    >
      <!-- main chart svg -->
      <Svg
        label="The distribution of wages for Black women, white women, Black men, and white men across {industryName ??
          'all occupation groups'}. The median wage for {handleGroupLabel(
          d.label
        )} across {d.n} occupations is equal to {format('$,.0f')(d.median)}"
      >
        <GroupText
          ><svelte:fragment slot="label">{d.label}</svelte:fragment>
          <svelte:fragment slot="count">{d.n} occupations</svelte:fragment>
        </GroupText>
        {#if d.n > 0}
          <Area
            fill={d.color}
            on:mousemove={(e) => handleMouseMove(e, d)}
            on:mouseout={handleMouseOut}
          />
          <DensityCurve on:mousemove={(e) => handleMouseMove(e, d)} on:mouseout={handleMouseOut} />
          <MedianLine on:mousemove={(e) => handleMouseMove(e, d)} on:mouseout={handleMouseOut} />
        {/if}
        <BaseLine />
        <!-- if last group, show the x axis -->
        {#if d.id === 4}
          <AxisX {clientWidth} />
        {/if}
      </Svg>

      <!-- if group is BW and no dropdown, show annotation -->
      {#if d.id === 1 && industryFilter === null}
        <Html zIndex={1} pointerEvents={false}>
          <Annotations {annotations} />
        </Html>
        <Svg
          zIndex={1}
          pointerEvents={false}
          label="The median wage income of Black women is {format('$,.0f')(medianValueBW)}"
        >
          <svelte:fragment slot="defs">
            <Arrowhead />
          </svelte:fragment>
          <Arrow {annotations} />
        </Svg>
      {/if}
    </LayerCake>
  {/each}
  <div class="logo">
    <LogoUrbanWide width={158} />
  </div>
</div>

{#if tooltipData}
  {@const d = tooltipData}
  <Tooltip x={dynamicX} y={dynamicY} triangleSize={0} size="large" orientation="top-right">
    <b>{d.n} Occupations</b>
    <br />
    <b>{format("$,.0f")(d.median)} Median Wage</b>
  </Tooltip>
{/if}

<style>
  .chart-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: end;
    width: 100%;
    height: 500px;
    max-width: 47.5rem;
  }

  .logo {
    position: relative;
    bottom: -50px;
    left: 0px;
  }

  :global(.logo svg) {
    overflow: initial;
  }
</style>
