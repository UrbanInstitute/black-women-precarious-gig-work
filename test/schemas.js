export const chart1DropdownSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["occ", "occ_string"],
    properties: {
      occ: { type: "number", uniqueItems: true },
      occ_string: { type: "string", uniqueItems: true }
    }
  }
};

export const chart1DataSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["med_inc_grp", "group_factor", "occ_broad"],
    properties: {
      med_inc_grp: { type: "number", exclusiveMinimum: 0 },
      group_factor: { enum: [1, 2, 3, 4] },
      occ_broad: { type: "number" }
    }
  }
};

export const toolOccDataSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      // occupation specific
      occ_id: { type: "integer" },
      occ_name: { type: "string" },
      occ_ind_id: { type: "integer" },

      //   perc
      perc_health: { type: "number", minimum: 0 },
      perc_retirement: { type: "number", minimum: 0 },
      perc_parttime: { type: "number", minimum: 0 },
      perc_temp: { type: "number", minimum: 0 },
      perc_indie: { type: "number", minimum: 0 },
      perc_contract: { type: "number", minimum: 0 },

      //   flag
      flag_parttime: { enum: [0, 1] },
      flag_health: { enum: [0, 1] },
      flag_retirement: { enum: [0, 1] },
      flag_temp: { enum: [0, 1] },
      flag_indie: { enum: [0, 1] },
      flag_contract: { enum: [0, 1] },
      flag_salary: { enum: [0, 1] },

      //   crowding
      c_nodi_wm: { enum: [1, 2, 3] },
      c_all_bm: { enum: [1, 2, 3] },
      c_all_wm: { enum: [1, 2, 3] },
      c_all_ww: { enum: [1, 2, 3] },
      c_nodi_bm: { enum: [1, 2, 3] },
      c_nodi_ww: { enum: [1, 2, 3] },
      c_di_bm: { enum: [1, 2, 3] },
      c_latinx_ww: { enum: [1, 2, 3] },
      c_latinx_wm: { enum: [1, 2, 3] },
      c_di_ww: { enum: [1, 2, 3] },
      c_di_wm: { enum: [1, 2, 3] },
      c_latinx_bm: { enum: [1, 2, 3] }
    },
    required: ["occ_id", "occ_name", "occ_ind_id"]
  }
};

export const toolOccSearchDataSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      // occupation specific
      occ_id: { type: "integer" },
      occ_name: { type: "string" },
      occ_ind_id: { type: "integer" },
      occ_ind_name: { type: "string" },

      //   crowding
      c_nodi_wm: { enum: [1, 2, 3] },
      c_all_bm: { enum: [1, 2, 3] },
      c_all_wm: { enum: [1, 2, 3] },
      c_all_ww: { enum: [1, 2, 3] },
      c_nodi_bm: { enum: [1, 2, 3] },
      c_nodi_ww: { enum: [1, 2, 3] },
      c_di_bm: { enum: [1, 2, 3] },
      c_latinx_ww: { enum: [1, 2, 3] },
      c_latinx_wm: { enum: [1, 2, 3] },
      c_di_ww: { enum: [1, 2, 3] },
      c_di_wm: { enum: [1, 2, 3] },
      c_latinx_bm: { enum: [1, 2, 3] }
    },
    required: ["occ_id", "occ_name", "occ_ind_id", "occ_ind_name"]
  }
};
