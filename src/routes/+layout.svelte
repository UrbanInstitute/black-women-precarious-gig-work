<script>
  import { Theme, FontsUrban, Analytics } from "@urbaninstitute/dataviz-components";
  import { PymChild } from "@urbaninstitute/dataviz-components";
  import "../app.css";
</script>

<PymChild polling={250} />
<svelte:head><title>Unstable Work is All Too Common, Especially for Black Women</title></svelte:head
>

<FontsUrban />
<Analytics title="black-women-precarious-gig-work" mode={import.meta.env.MODE} />
<Theme>
  <slot />
</Theme>
