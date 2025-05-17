import dayjs, { type Dayjs } from "dayjs";

import { API_DATE_FORMAT } from "@/const/common";

export function getDateFromEvent(date?: Dayjs | [Dayjs, Dayjs]) {
  if (Array.isArray(date)) {
    return date.filter(dayjs.isDayjs).map((d) => d.format(API_DATE_FORMAT));
  }

  return dayjs.isDayjs(date) ? date.format(API_DATE_FORMAT) : undefined;
}
