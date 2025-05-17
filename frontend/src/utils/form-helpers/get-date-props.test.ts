import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { getDateProps } from "./get-date-props";

describe("getDateProps", () => {
  const date = "2023-01-13";

  it("should convert the provided date to `dayjs` date", () => {
    expect(getDateProps(date)).toEqual({ value: dayjs(date) });
  });

  it("should convert the provided array of dates to an array of `dayjs` dates", () => {
    // @ts-expect-error check for undefined
    expect(getDateProps([date, undefined, date])).toEqual({
      value: [dayjs(date), dayjs(date)],
    });
  });

  it("should return `undefined` if date is not provided", () => {
    expect(getDateProps()).toEqual({
      value: undefined,
    });
  });
});
