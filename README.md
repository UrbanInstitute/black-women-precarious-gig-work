# Precarious Work

4 charts and a tool for exploring precarity of Black women's occupations.

- [Chart 1: Svelte-based ridgeline plot](#chart-1-ridgeline-plot-srcrouteschart1-and-componentsridgeplot)
- [Chart 2: Svelte-based toggle between two Datawrapper charts](#chart-2-datawrapper-toggle-routeschart2)
- [Charts 3 & 4: Datawrapper chart embedded on the CMS](#charts-3--4-standalone-datawrapper-charts-in-the-cms)
- [Tool: Svelte-based waffle chart and sidebar](#tool-routestool-and-componentstool)

## Project Details

Data Visualization and Development: Ben Kates

Designer: Christina Baird

Writer: Wes Jenkins

Research: Ofronama Biu and Afia Adu-Gyamfi

Editing: Alex Dallman

### Hosting Location (`/lines` and `/maps` endpoints)

Production: https://apps.urban.org/features/black-women-precarious-gig-work

Drupal page: https://urban.org/data-tools/black-women-precarious-gig-work

## Data

### Output Data (`R/data-output/` and `$data/`)

Note: `$data` is shorthand for `src/data`

- `R/data-output` contains all CSV files for Datawrapper and are prefixed with `chart#` (ie: `chart2-all.csv`)
- `$data/chart1/` contains JSON files for the ridgeline plot
  - `data.json` is the main file for the visualization
  - `dropdown.json` is the calculated data for the dropdown
- `$data/tool/` contains JSON files for the tool section of the project
  - `occupations.json` is the main file for the visualization.
  - `occupations-search.json` is the file for the searchbar, creating a list of occupations based on the `unique()` function in R, and arranging appropriately as to not waste compute on JavaScript-based sorting

### Testing (`test/)

`main.test.js` uses [`ajv`](https://ajv.js.org/) for JSON schema validation in `vitest`. Schema files can be found in `test/schemas.js`.

### Manually Created Data

`$data/tool/dropdowns.json` is a file to determine the order and structure of dropdowns in the tool section. This was determined by the writer.

## Chart 1: Ridgeline Plot (`src/routes/chart1/` and `$components/RidgePlot/`)

- `<RidgePlot>` is the parent component, making use of [LayerCake](https://layercake.graphics/) for the visualization
  - Within the `<script/>` of this file, the `density1d` function from the [fast-kde](https://www.npmjs.com/package/fast-kde) package is used to calculate the density of the data to create the ridgelines.
  - Additionally, this is where the annotations are configured in order to pass to `<Annotations>`, copied from LayerCake's site, which also uses `<Arrow>` and `<Arrowhead>`. It's worth noting there are a few different manual configurations depending on the `clientWidth`.
    - `$utils/arrowUtils.js` is referenced by the `<Arrow>` component in order to
- `<Area>`, `<DensityCurve>`, `<MedianLine>`, and `<AxisX>` are the actual ridgeline plot visualization components.
- `<GroupText>` contains the text for the groups that sits to the left of the visualizations.

## Chart 2: Datawrapper Toggle (`routes/chart2`)

Simple toggle between two Datawrapper charts. Be sure that the two charts show as the same height in order to avoid height flickering on toggle change. One of the charts had a different y axis max so the height was rendering different from the other.

Chart 2 (all): https://www.datawrapper.de/_/tbQ0D/

Chart 2 (crowded in only): https://www.datawrapper.de/_/NPqXN/

## Charts 3 & 4: Standalone Datawrapper Charts in the CMS

Chart 3: https://www.datawrapper.de/_/iplKP/

Chart 4: https://www.datawrapper.de/_/fCvxa/

## Tool (`routes/tool` and `$components/Tool`)

Waffle chart-based tool for exploring the dataset, contains dropdowns for controlling the dataset filtering and highlighting, as well as a sidebar for individual occupation information.

### Components

- `<WaffleParent>` parent for the entire waffle chart section. LayerCake-based. Sets metadata, row count, radius, and cell dimensions based on `clientWidth` for the `<WaffleChart>` children. Also declares the single `Tooltip` from the `@urbaninstitute/dataviz-components` library.
  - `WaffleChart` is the individual waffle chart that displays SVG like `<rect>` (cells) and `<circle>` (nodes) for the chart elements. It configures hover/click functionality too.
    - The component also creates a custom `<path>` for the "node outline" feature via the `outlinePath` variable. Tip: the [SVG Path Visualizer tool](https://svg-path-visualizer.netlify.app/#M%200%200%20H%20100%20V%2050%20H%2020%20V%20100%20H%200%20L%200%200) was helpful in constructing the logic for this.
- `<Dropdowns>` and `<DropdownsMobile>` are components for the dropdowns to control the characteristic, identity, and comparison variables. This uses the `@urbaninstitute/dataviz-components` library. The mobile version is a "madlibs" style.
- `<Search>` uses [svelte-typeahead](https://github.com/metonym/svelte-typeahead) for a searchbox across occupations.
- `<Sidebar>` displays associated occupation data based on a derived store `$selectedOccData`.

### Stores (`$stores`)

- `hovered-occ.js` holds the stores for hovered occupation and mouse position.
- `search.js` holds the searchbox value in order to explicit control over the value when resetting stores.
- `selected-dropdowns.js` holds the selected dropdown values, as well as the dynamically constructed identity/comparison field to access for the correct data (ie: `c_all_wm` or `c_di_bm`).
- `selected-occ.js` is the store for the selected occupation and associated data/crowding designation, which is used to display data in the `<Sidebar>`. This file also contains the `$selectedNode` store, used for maintaining the highlight/tooltip when selecting an occupation outside of the visualization.
- `window-width.js` contains the stores for the `windowWidth` and a boolean for whether or not the `windowWidth` is less than 768 to indicate a mobile experience.

### Utility functions (`$utils`)

- `/helper.js` contains functions for fetching crowding labels/colors
- `/resizeFix.js` is used to fix the resize issue found on the CMS with `clientHeight` dependent components

## Developing

To set up the project locally, install dependencies and run:

```sh
npm install
npm run dev
```

## Deploy

See the above starter kit for information on how this project is deployed via CircleCI.

## Env Variables

All environment variables for this project are controlled via CircleCI.
