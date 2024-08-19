import { urbanColors } from "@urbaninstitute/dataviz-components/utils";

/**
 * @param {string|number} x
 * @param {boolean} css - whether to use css variable or hex color
 */
export const getCrowdingColor = (x, css = false) => {
  switch (x) {
    // if value is numeric or string, return color
    case 1:
    case "1":
      return css ? "var(--color-blue)" : urbanColors.blue;
    case 2:
    case "2":
      return css ? "var(--color-yellow)" : urbanColors.yellow;
    case 3:
    case "3":
      return css ? "var(--color-blue-shade-darker)" : urbanColors.getBlues()[6];
    default:
      break;
  }
};

/**
 * @param {string|number} x
 */
export const getCrowdingLabel = (x) => {
  switch (x) {
    case 1:
    case "1":
      return "Crowded Out";
    case 2:
    case "2":
      return "Proportional";
    case 3:
    case "3":
      return "Crowded In";
    default:
      break;
  }
};
