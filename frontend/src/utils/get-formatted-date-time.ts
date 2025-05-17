import { APP_DATE_TIME_FORMAT } from "../const/common";

import { getFormattedDate } from "./get-formatted-date";

export function getFormattedDateTime(date: string) {
  return getFormattedDate(date, APP_DATE_TIME_FORMAT);
}
