import dayjs from "dayjs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { getWeekRange } from "./get-week-range";

describe("getWeekRange", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-09-19"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns the range for last 7 days by default", () => {
    const [startOfWeek, endOfWeek] = getWeekRange();

    expect(startOfWeek).toBe("2023-09-13");
    expect(endOfWeek).toBe("2023-09-19");
  });

  it("returns the week range for a specified date", () => {
    const fromDate = "2023-09-01";
    const [startOfWeek, endOfWeek] = getWeekRange(fromDate);

    expect(startOfWeek).toBe("2023-08-26");
    expect(endOfWeek).toBe("2023-09-01");
  });

  it("returns the week range for a specified date (using dayjs)", () => {
    const fromDate = dayjs("2023-09-15");
    const [startOfWeek, endOfWeek] = getWeekRange(fromDate);

    expect(startOfWeek).toBe("2023-09-09");
    expect(endOfWeek).toBe("2023-09-15");
  });
});
