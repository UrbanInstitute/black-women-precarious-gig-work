<!--
  @component
  X axis for ridgeplot. https://layercake.graphics/components/AxisX.svelte
 -->
<script>
  import { getContext } from "svelte";
  import { format } from "d3-format";
  const { width, height, xScale, yRange } = getContext("LayerCake");

  /** @type {Number} [dx=0] - Any optional value passed to the `dx` attribute on the text label. */
  export let dx = 0;

  /** @type {Number} [dy=12] - Any optional value passed to the `dy` attribute on the text label. */
  export let dy = 20;

  /** @type {Boolean} [snapLabels=false] - Instead of centering the text labels on the first and the last items, align them to the edges of the chart. */
  export let snapLabels = false;

  export let clientWidth = 500;

  /**
   * @param {number} i
   * @param {boolean} sl
   */
  function textAnchor(i, sl) {
    if (sl === true) {
      // if (i === 0) {
      //   return "start";
      // }
      if (i === tickVals.length - 1) {
        return "end";
      }
    }
    return "middle";
  }

  /** @type {Number|Array|Function} [ticks] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */
  $: ticks = clientWidth < 510 ? 3 : 5;

  $: tickLen = 7;

  $: isBandwidth = typeof $xScale.bandwidth === "function";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
      ? $xScale.domain()
      : typeof ticks === "function"
        ? // @ts-ignore
          ticks($xScale.ticks())
        : $xScale.ticks(ticks);

  $: halfBand = isBandwidth ? $xScale.bandwidth() / 2 : 0;
</script>

<g
  class="axis x-axis"
  transform="translate(0,15)"
  class:snapLabels
  role="presentation"
  aria-hidden="true"
>
  <line class="axis-baseline" y1={$height} y2={$height} x1="0" x2={$width} />
  {#each tickVals as tick, i (tick)}
    <g class="tick tick-{i}" transform="translate({$xScale(tick)},{Math.max(...$yRange)})">
      <line class="tick-mark" x1={halfBand} x2={halfBand} y1={-1} y2={tickLen + 1} />
      <text x={halfBand} y={tickLen} {dx} {dy} text-anchor={textAnchor(i, snapLabels)}
        >{tick === 0 ? "$0" : format("$.2s")(tick)}</text
      >
    </g>
  {/each}
</g>

<style>
  .tick {
    font-size: var(--font-size-normal);
  }

  line,
  .tick line {
    stroke: #000;
    stroke-width: 2;
  }

  .tick text {
    fill: #000000;
  }

  /* This looks slightly better */
  .axis.snapLabels .tick:last-child text {
    transform: translateX(16px);
  }
</style>
