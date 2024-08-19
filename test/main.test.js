import { describe, it, expect } from "vitest";
import Ajv from "ajv";
// import datasets
import chart1DropdownData from "$data/chart1/dropdown.json";
import chart1Data from "$data/chart1/data.json";
import toolOccData from "$data/tool/occupations.json";
import toolOccSearchData from "$data/tool/occupation-search.json";
// import dataset schemas
import {
  chart1DropdownSchema,
  chart1DataSchema,
  toolOccDataSchema,
  toolOccSearchDataSchema
} from "./schemas";

const dataSchemaValidation = (description, data, schema) => {
  it(description, () => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      console.error(validate.errors);
    }
    expect(valid).toBe(true);
  });
};

const ajv = new Ajv();

//******************************
//* CHART 1 */
//******************************
describe("ridgeplot (chart 1) JSON data validation", () => {
  dataSchemaValidation(
    "validates ridgeplot dropdown data against schema",
    chart1DropdownData,
    chart1DropdownSchema
  );

  dataSchemaValidation("validates ridgeplot data against schema", chart1Data, chart1DataSchema);
});

//******************************
//* TOOL */
//******************************
describe("tool JSON data validation", () => {
  dataSchemaValidation(
    "validates waffle chart data against schema",
    toolOccData,
    toolOccDataSchema
  );

  dataSchemaValidation(
    "validates tool search data against schema",
    toolOccSearchData,
    toolOccSearchDataSchema
  );
});
