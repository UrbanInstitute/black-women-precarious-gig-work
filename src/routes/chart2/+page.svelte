<script>
  import { DatawrapperIframe, Toggle, logClickToGA } from "@urbaninstitute/dataviz-components";

  $: toggleState = false;
  $: selectedChart = toggleState ? "NPqXN" : "tbQ0D";
  let ariaLabel = "chart";
</script>

<main>
  <div class="toggle-parent">
    <Toggle
      bind:active={toggleState}
      on:click={(e) => {
        logClickToGA(e.target, `chart2_toggle_click--${toggleState ? "crowded in" : "all"}`);
      }}
      label="See only crowded in"
    />
  </div>
  <div class="container">
    {#key selectedChart}
      <DatawrapperIframe
        title={"Average median wages"}
        {ariaLabel}
        height="463"
        datawrapperId={selectedChart}
      />
    {/key}
  </div>
</main>

<style>
  .container {
    height: fit-content;
  }

  .toggle-parent {
    display: flex;
    justify-content: end;
    margin-bottom: 1rem;
  }

  :global(.toggle) {
    width: 50px !important;
    height: 24px !important;
    border-radius: 12px !important;
  }

  :global(.circle) {
    width: 18px !important;
    height: 18px !important;
    border-radius: 9px !important;
  }

  :global(button[aria-checked="true"] .circle) {
    transform: translate(28px, 2px) !important;
  }
</style>
