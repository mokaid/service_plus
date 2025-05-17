import { formatDateHeader } from "@/utils/general-helpers";

const DateTime = () => {
  const inputDate = new Date();

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <>
      {formatDateHeader(inputDate)}
      {", "}
      {days[inputDate.getDay()]}
      {", "}
      {inputDate.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}
    </>
  );
};

export default DateTime;
