<!--
  @component
  Generates the SVG path for the line of the density curve.
 -->

<script>
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const { data, xGet, yGet, height, width } = getContext("LayerCake");

  export let stroke = "#fff";
  export let strokeWidth = 3;

  $: path =
    "M" +
    $data
      .map((/** @type {any} */ d) => {
        return $xGet(d) + "," + $yGet(d);
      })
      .join("L");
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<g
  role="presentation"
  on:mousemove={(e) => {
    dispatch("mousemove", { e });
  }}
  on:mouseout={(e) => {
    dispatch("mouseout", { e });
  }}
>
  <path class="path-line" d={path} {stroke} stroke-width={strokeWidth}></path>
  <!-- <line class="baseline" y1={$height} y2={$height} x1="0" x2={$width} /> -->
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  /* .baseline {
    stroke: #d2d2d2;
    stroke-width: 2;
  } */
</style>
