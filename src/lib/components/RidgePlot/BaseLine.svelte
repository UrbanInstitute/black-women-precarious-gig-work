<script>
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";

  const { height, width } = getContext("LayerCake");
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<g role="presentation">
  <line
    class="baseline"
    y1={$height}
    y2={$height}
    x1="0"
    x2={$width}
    stroke="#d2d2d2"
    stroke-width="2"
  />
</g>
