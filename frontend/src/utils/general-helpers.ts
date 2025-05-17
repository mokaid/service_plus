export const getLastWeekDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
};
export const getLastMonthDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
};
export const getLastDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
};
export const getTodayDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
export const getCurrentYear = (date: Date) => {
  return new Date(date.getFullYear(), 0, 1);
};
export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
};

var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const formatDateHeader = (date: Date) => {
  return ` ${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
