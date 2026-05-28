export const type_field = "Type";
export const status_field = "Status";
export const category_field = "Category";
export const statusStateValues = [1, 2, 3, 4];

//--- type definitions
export type StatusTypenamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed";
export type StatusStateType = "comp" | "incomp" | "ongoing" | "delayed";
export type LayerNameType = "utility" | "viaduct" | "others";
export type TypeFieldType = "number" | "string";

// Media parameters
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

// month
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const station_field = "Station1";

//--- station types
export const structure_category_labels = [
  "D-Wall",
  "Column",
  "Slab",
  "Kings Post",
  "Secant Pile",
  "Column Head",
];

// station structure name list
export const structure_category_field = "Type";
export const structure_category_values = [1, 2, 3, 4, 5, 6];
export const structureCategoryTypes = structure_category_labels.map(
  (label: any, index: any) => {
    return Object.assign({
      category: label,
      value: structure_category_values[index],
    });
  },
);

export const statusLabels = ["incomp", "ongoing", "delayed", "comp"];
export const statusValues = [1, 2, 3, 4];
export const statusArray = statusLabels.map((status: any, index: any) => {
  return Object.assign({
    status: status,
    value: statusValues[index],
  });
});

//--- chart parameters
export const chart_colors = ["#000000", "#f7f7f7ff", "#FF0000", "#0070ff"];
