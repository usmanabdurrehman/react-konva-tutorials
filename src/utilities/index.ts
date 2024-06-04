import { ICON_FILL_COLOR } from "../constants";

export const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getNumericVal = (val: number | undefined) => val || 0;

export const getIconColorProps = (isSelected: boolean | undefined) => ({
  fill: isSelected ? ICON_FILL_COLOR : "none",
  stroke: isSelected ? ICON_FILL_COLOR : "currentColor",
});
