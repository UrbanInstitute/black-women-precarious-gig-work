<!--
  @component
  Generates an SVG area shape.
 -->
<script>
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  const { data, xGet, yGet, xScale, yScale, extents } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let fill = "#fff";

  // create path string
  $: path =
    "M" +
    $data
      .map((/** @type {any} */ d) => {
        return $xGet(d) + "," + $yGet(d);
      })
      .join("L");

  /**  @type {String} **/
  let area;

  $: {
    const yRange = $yScale.range();
    area =
      path +
      ("L" +
        $xScale($extents.x ? $extents.x[1] : 0) +
        "," +
        yRange[0] +
        "L" +
        $xScale($extents.x ? $extents.x[0] : 0) +
        "," +
        yRange[0] +
        "Z");
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<path
  class="path-area"
  d={area}
  {fill}
  role="presentation"
  on:mousemove={(e) => {
    dispatch("mousemove", { e });
  }}
  on:mouseout={(e) => {
    dispatch("mouseout", { e });
  }}
></path>
