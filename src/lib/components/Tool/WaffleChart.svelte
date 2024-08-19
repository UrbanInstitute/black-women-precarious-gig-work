<!--
  @component
  Nodes for waffle chart
 -->
<script>
  // import stores and utils
  import { selectedCharacteristic } from "$stores/selected-dropdowns";
  import { selectedOcc, selectedNode } from "$stores/selected-occ";
  import { hoveredOccName, hoveredPosition } from "$stores/hovered-occ";
  import { searchValue } from "$stores/search";
  import { windowIsMobile } from "$stores/window-width";
  import { logClickToGA } from "@urbaninstitute/dataviz-components";
  // import layercake
  import { getContext } from "svelte";
  const { data, custom, width } = getContext("LayerCake");
  import { raise } from "layercake";

  // number of rows to include in the waffle chart
  export let rowCount = 5;

  // radius of the nodes
  export let r = 7;

  // cell width/height for each node (node of radius r goes inside a rect of these dimensions)
  export let cellWidth = 19;
  export let cellHeight = 22;

  // get total count of occupations in dataset
  $: totalCount = $data.length;
  $: totalFlagCount = $data.filter(
    (/** @type {{ [x: string]: number; }} */ d) => d["flag_" + $selectedCharacteristic] === 1
  ).length;

  // create the outline path of the highlighted area in the waffle chart
  $: outlinePath = ``;
  $: {
    outlinePath =
      // start from top left and go to top right
      /*1*/ `M 0 0 H ${Math.ceil(totalFlagCount / rowCount) * cellWidth}` +
      // go down as many rows as needed
      /*2*/ `V ${((totalFlagCount / rowCount) % 1 !== 0 ? (totalFlagCount / rowCount) % 1 : 1) * rowCount * cellHeight}`;

    // if there is an incomplete column, add steps 3 and 4
    if (totalFlagCount / rowCount > 1 && (totalFlagCount / rowCount) % 1 !== 0) {
      outlinePath +=
        // go back one column
        /*3*/ `H ${(Math.ceil(totalFlagCount / rowCount) - 1) * cellWidth}` +
        // go down to end of rows
        /*4*/ `V ${rowCount * cellHeight}`;
    }
    // finish off by going to bottom left, top left (start)
    outlinePath += /*5*/ `H 0` + /*6*/ `L 0 0`;
  }

  /**
   * detect if index exists in array
   * @param {any[]} array
   * @param {number} index
   */
  function hasIndex(array, index) {
    return index >= 0 && index < array.length;
  }

  // on mouseover, set the hovered position and occupation name
  const handleMouseOver = (
    /** @type {(MouseEvent | KeyboardEvent | FocusEvent & { currentTarget: EventTarget & SVGRectElement; })} */ e,
    /** @type {number} */ index
  ) => {
    if (!$windowIsMobile) {
      $hoveredPosition = {
        // @ts-ignore
        x: e?.pageX,
        // @ts-ignore
        y: e?.pageY
      };
      $hoveredOccName = $data[index].occ_name;
    }
  };

  // on mouseleave, set the hovered position and occupation name to null
  const handleMouseLeave = () => {
    if (!$windowIsMobile) {
      $hoveredPosition.x = null;
      $hoveredPosition.y = null;
      $hoveredOccName = null;
    }
  };

  const handleClick = (
    /** @type {MouseEvent & { currentTarget: EventTarget & SVGRectElement; } | FocusEvent} */ e,
    /** @type {number} */ index
  ) => {
    if (!$windowIsMobile) {
      // reset hoveredPosition so it sticks to the node on click
      $hoveredPosition.x = null;
      $hoveredPosition.y = null;
      // set selected occupation
      $selectedOcc = $data[index].occ_id;
      $searchValue = $data[index].occ_name;
      // @ts-ignore
      logClickToGA(e.target, `tool_node_select--${$data[index].occ_name}`);
    }
  };

  // if there's a SELECTED element and width size detection, get the position of the selected node
  $: {
    if ($selectedNode && $width) {
      // if the background highlight exists, raise it to the top
      raise($selectedNode);
    }
  }
</script>

<!-- background highlight -->
{#each Array(Math.ceil(totalCount / rowCount)) as _, col}
  {#each Array(rowCount) as i, row}
    <!-- current column times the number of rows plus current row -->
    {@const index = col * rowCount + row}
    <!-- if the array has the index value, print the svg to the dom -->
    {#if hasIndex($data, index)}
      <!-- if the flag is present, set background -->
      <rect
        x={col * cellWidth}
        y={row * cellHeight}
        width={cellWidth + 0.5}
        height={cellHeight + 0.5}
        fill={$data[index]["flag_" + $selectedCharacteristic] === 1
          ? $custom.bgColor
          : "transparent"}
        pointer-events="none"
      />
    {/if}
  {/each}
{/each}

<!-- background highlight perimeter -->
{#if totalFlagCount > 0}
  <path
    d={outlinePath}
    fill="none"
    stroke={$custom.color}
    stroke-width="1"
    stroke-linecap="square"
    pointer-events="none"
  />
{/if}

<!-- nodes and selected node outline -->
<g role="presentation" aria-hidden="true">
  {#each Array(Math.ceil(totalCount / rowCount)) as i, col}
    {#each Array(rowCount) as j, row}
      <!-- current column times the number of rows plus current row -->
      {@const index = col * rowCount + row}
      <!-- if the array has the index value, print the svg to the dom -->
      {#if hasIndex($data, index)}
        <!-- if the occupation is selected, set outline -->
        {#if $data[index].occ_id === $selectedOcc}
          <circle
            cx={(col + 0.5) * cellWidth}
            cy={(row + 0.5) * cellHeight}
            r={r + 3}
            fill="none"
            stroke="black"
            stroke-width="2px"
            bind:this={$selectedNode}
          />
        {/if}
        <!-- actual node for occupation -->
        <circle
          cx={(col + 0.5) * cellWidth}
          cy={(row + 0.5) * cellHeight}
          {r}
          fill={$custom.color}
        />

        <!-- fake rect to capture interaction events -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <rect
          x={col * cellWidth}
          y={row * cellHeight}
          width={cellWidth + 0.5}
          height={cellHeight + 0.5}
          fill="transparent"
          on:mouseenter={(e) => handleMouseOver(e, index)}
          on:mouseover={(e) => handleMouseOver(e, index)}
          on:mousemove={(e) => handleMouseOver(e, index)}
          on:click={(e) => handleClick(e, index)}
          on:mouseout={handleMouseLeave}
          aria-hidden="true"
        />
      {/if}
    {/each}
  {/each}
</g>

<style>
  circle,
  rect {
    cursor: pointer;
    outline: none;
  }

  @media (max-width: calc(48rem - 1px)) {
    circle,
    rect {
      cursor: default;
    }
  }
</style>
