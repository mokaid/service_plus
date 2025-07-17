import { Tag } from "antd";

const Status = ({ status }: { status: any }) => {
  var type = "Admin";
  var color = "blue";

  if (status === 0) {
    type = "Pending";
    color = "gold";
  } else if (status === 1) {
    type = "Dispatched";
    color = "red";
  } else {
    type = "Accomplished";
    color = "green";
  }

  return <Tag color={color}>{type}</Tag>;
};
export default Status;
