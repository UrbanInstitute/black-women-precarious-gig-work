<script>
  import { Theme, FontsUrban, Analytics } from "@urbaninstitute/dataviz-components";
  import { PymChild } from "@urbaninstitute/dataviz-components";
  import "../app.css";
</script>

<PymChild polling={250} />

<FontsUrban />
<Analytics title="precarious-work" mode={import.meta.env.MODE} />
<Theme>
  <slot />
</Theme>
