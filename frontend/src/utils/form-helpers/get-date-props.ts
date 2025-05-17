import dayjs from "dayjs";

export function getDateProps(date?: string | string[]) {
  if (Array.isArray(date)) {
    return {
      value: date.filter((d) => typeof d === "string").map((d) => dayjs(d)),
    };
  }

  return {
    value: typeof date === "string" ? dayjs(date) : undefined,
  };
}
