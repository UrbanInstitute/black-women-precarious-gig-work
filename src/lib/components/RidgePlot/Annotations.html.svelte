<!--
  @component
  Adds text annotations based on a config object that has CSS styles as fields.
  https://layercake.graphics/components/Annotations.html.svelte
 -->
<script>
  import { resizeFix } from "$utils/resizeFix";

  const vals = ["top", "right", "bottom", "left"];
  // @ts-ignore
  /** @type {Array} annotations - A list of annotation objects. It expects values of `top`, `right`, `bottom` and `left` whose values are CSS values like `'10px'` or `'5%'` that will be used to absolutely position the text div. See the [Column](https://layercake.graphics/example/Column) chart example for the schema and options. */
  export let annotations = [];

  /** @type {Function} [getText=d => d.text] - An accessor function to get the field to display. */
  export let getText = (d) => d.text;

  $: fillStyle = (d) => {
    let style = "";
    vals.forEach((val) => {
      if (d[val]) {
        style += `${val}:${d[val]};`;
      }
    });
    return style;
  };
</script>

<div class="layercake-annotations" use:resizeFix role="presentation" aria-hidden="true">
  {#each annotations as d, i}
    <div class="layercake-annotation" data-id={i} style={fillStyle(d)}>{getText(d)}</div>
  {/each}
</div>

<style>
  .layercake-annotation {
    position: absolute;
    font-weight: var(--font-weight-bold);
    font-size: 1rem;
  }
</style>
