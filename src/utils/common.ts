export const ensureNumber = (value: number | string) => {
  if (typeof value === "number") {
    return value;
  }
  return parseInt(value, 10);
};
