import { describe, expect, it } from "vitest";

import { getFormattedDate } from "./get-formatted-date";

describe("getFormattedDate", () => {
  it("should return the formatted date", () => {
    const date = new Date("2023-01-01").toISOString();

    expect(getFormattedDate(date)).toBe("01\u00A0Jan\u00A02023");
  });

  it("should return the date with provided format", () => {
    const date = new Date("2023-01-01").toISOString();

    expect(getFormattedDate(date, "MMM DD")).toBe("Jan 01");
  });
});
