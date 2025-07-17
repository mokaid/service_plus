import { Button, Tag } from "antd";
import type { ColumnType } from "antd/es/table";

import { PoweroffOutlined } from "@ant-design/icons";
import { OrganisationSite } from "@/types/organisation";

type ColumnParams = {
  onClick: (site: OrganisationSite) => void;
};

export const generateColumns = ({
  onClick,
}: ColumnParams): ColumnType<OrganisationSite>[] => [
  {
    title: "ID",
    dataIndex: "id",
    width: 88,
    sorter: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    width: 160,
    render: (value, record) => (
      <Button onClick={() => onClick(record)} type="link">
        {value}
      </Button>
    ),
  },
  // {
  //   title: "Client Name",
  //   dataIndex: "vendor",
  //   width: 100,
  //   sorter: true,
  // },
  {
    title: "Status",
    sorter: true,
    dataIndex: "connectionState",
    width: 100,
    render: (state: boolean) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Tag color={state ? "green" : "red"}>
          {" "}
          <PoweroffOutlined /> {state ? "Online" : "Offline"}{" "}
        </Tag>
      </div>
    ),
  },
];
