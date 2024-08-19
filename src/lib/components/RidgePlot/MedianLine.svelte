<!--
  @component
  Vertical median line in ridge
 -->
<script>
  import { createEventDispatcher, getContext } from "svelte";
  const { data, xGet, yGet, custom } = getContext("LayerCake");
  import { scaleLinear } from "d3-scale";
  const dispatch = createEventDispatcher();

  export let stroke = "white";
  export let strokeWidth = 3;

  // create an interpolated scale for the y value
  $: xScaleInterpolated = scaleLinear()
    .domain($data.map((/** @type {{ x: any; }} */ d) => d.x))
    .range($data.map((/** @type {{ y: any; }} */ d) => d.y));

  $: medianObj = { x: $custom.median, y: xScaleInterpolated($custom.median) };
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
  {#each [0] as _ (_)}
    <line
      class="median-line"
      x1={$xGet(medianObj)}
      x2={$xGet(medianObj)}
      y1={$yGet({ y: 0 })}
      y2={$yGet(medianObj)}
      {stroke}
      stroke-width={strokeWidth}
    ></line>
  {/each}
</g>
