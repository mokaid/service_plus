import { Button, Space } from "antd";
import type { ColumnType } from "antd/es/table";
import { User } from "@/types/user";
// import { decodeBase64 } from "@/utils/decodeBase64";
import UserStatus from "./UserStatus";
import AccountType from "./AccountType";
import DeleteUserButton from "./DeleteUserButtons";
import {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";

type Props = {
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<any, any, any, any, any>
  >;
  onEdit: React.Dispatch<React.SetStateAction<User | false>>;
};

export const generateColumns = ({
  refetch,
  onEdit,
}: Props): ColumnType<User>[] => [
  {
    title: "Username",
    sorter: true,
    dataIndex: "userName",
  },
  {
    title: "Nick Name",
    sorter: true,
    render: (_, record) => record.nickName || "-",
  },
  {
    title: "Account Type",
    sorter: true,
    render: (_, record) => <AccountType user={record} />,
  },
  {
    title: "Status",
    sorter: false,
    dataIndex: "status",
    render: (value) => <UserStatus status={value} />,
  },
  {
    title: "Actions",
    sorter: false,
    fixed: "right",
    render(_, user) {
      return (
        <Space>
          <Button size="small" onClick={() => onEdit(user)} type="primary">
            Edit
          </Button>
          <DeleteUserButton refetch={refetch} user={user} />
        </Space>
      );
    },
  },
];
