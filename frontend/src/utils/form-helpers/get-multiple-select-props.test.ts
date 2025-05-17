import { describe, expect, it } from "vitest";

import { getMultipleSelectProps } from "./get-multiple-select-props";

describe("getMultipleSelectProps", () => {
  it("should return an object with the same value if provided value is array", () => {
    const value = [1, 2];

    expect(getMultipleSelectProps(value)).toEqual({
      value,
    });
  });

  it("should return an object with the array with value if provided value is not array", () => {
    const value = 1;

    expect(getMultipleSelectProps(value)).toEqual({
      value: [value],
    });
  });

  it("should return an object with an empty array if provided value is undefined", () => {
    expect(getMultipleSelectProps()).toEqual({
      value: [],
    });
  });
});
