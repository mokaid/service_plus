import { Tag } from "antd";

const UserStatus = ( {status}: {status: boolean} ) => <Tag color={status ? "success" : "error"}>{status ? "Active" : "Inactive"}</Tag>
export default UserStatus;