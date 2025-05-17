import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { getDateFromEvent } from "./get-date-from-event";

describe("getDateFromEvent", () => {
  const date = new Date("2023-01-13");

  it("should return the formatted date", () => {
    expect(getDateFromEvent(dayjs(date))).toBe("2023-01-13");
  });

  it("should return an array of the formatted dates", () => {
    // @ts-expect-error check for undefined
    expect(getDateFromEvent([dayjs(date), undefined, dayjs(date)])).toEqual([
      "2023-01-13",
      "2023-01-13",
    ]);
  });

  it("should return `undefined` if the provided date is not a `dayjs` date", () => {
    expect(getDateFromEvent()).toBeUndefined();
  });
});
