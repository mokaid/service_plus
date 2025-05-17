import { Tag } from "antd";

const AccountType = ({ user }: { user: any }) => {
  var type = "Admin";
  var color = "blue";

  if (user?.role === 99) {
    type = "Customer";
    color = "gold";
  } else if (user?.role === 33) {
    type = "User";
    color = "purple";
  }

  return <Tag color={color}>{type}</Tag>;
};
export default AccountType;
