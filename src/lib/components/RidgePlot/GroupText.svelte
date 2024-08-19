<!--
  @component
  Grouping field text for the ridgeplot
 -->
<script>
  import { getContext } from "svelte";
  const { height } = getContext("LayerCake");
</script>

<g role="presentation" aria-hidden="true">
  <text x="-6" y={$height - 18} text-anchor="end" font-size="1rem">
    <slot name="label" />
  </text>
  <text x="-6" y={$height} text-anchor="end" font-size="1rem">
    <slot name="count" />
  </text>
</g>
