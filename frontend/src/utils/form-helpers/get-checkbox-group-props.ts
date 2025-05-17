export function getCheckboxGroupProps<T>(value?: T | T[]) {
  if (typeof value === "undefined") {
    return {
      value: [],
    };
  }

  return {
    value: Array.isArray(value) ? value : [value],
  };
}
