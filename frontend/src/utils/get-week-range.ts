import dayjs from "dayjs";

import { API_DATE_FORMAT } from "../const/common";

import { getFormattedDate } from "./get-formatted-date";

export function getWeekRange(
  fromDate: string | number | Date | dayjs.Dayjs = new Date(),
): [startOfWeek: string, endOfWeek: string] {
  const startDate = getFormattedDate(
    dayjs(fromDate).subtract(6, "days"),
    API_DATE_FORMAT,
  );
  const endDate = getFormattedDate(fromDate, API_DATE_FORMAT);

  return [startDate, endDate];
}
