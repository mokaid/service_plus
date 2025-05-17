import dayjs from "dayjs";

import { APP_DATE_FORMAT } from "../const/common";

export function getFormattedDate(
  date: string | number | Date | dayjs.Dayjs,
  format: string = APP_DATE_FORMAT,
) {
  return dayjs(date).format(format);
}
