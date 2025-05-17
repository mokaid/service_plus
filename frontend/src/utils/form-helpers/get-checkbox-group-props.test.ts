import { describe, expect, it } from "vitest";

import { getCheckboxGroupProps } from "./get-checkbox-group-props";

describe("getCheckboxGroupProps", () => {
  it("should return an object with the same value if provided value is array", () => {
    const value = ["1", "2"];

    expect(getCheckboxGroupProps(value)).toEqual({
      value,
    });
  });

  it("should return an object with the array with value if provided value is not array", () => {
    const value = "1";

    expect(getCheckboxGroupProps(value)).toEqual({
      value: [value],
    });
  });

  it("should return an object with an empty array if provided value is undefined", () => {
    expect(getCheckboxGroupProps()).toEqual({
      value: [],
    });
  });
});
