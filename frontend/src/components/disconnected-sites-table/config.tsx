import { Tag, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { DeviceEvent } from "@/types/device-event";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: any) => void;
};

export const generateColumns = ({
  onProcess,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Site",
    dataIndex: "name",
  },
  {
    title: "Box Type",
    dataIndex: "boxType",
    render: (value) => <Tag color={(value == 1) ? "orange" : "cyan"}> { (value == 1) ? "Lite Version" : "Standard Version" } </Tag>
  },
  {
    title: "Status",
    render: (_, record) => (!record?.latitude && !record?.longitude) && <span style={{ color: `rgb(241, 50, 50)` }}>No GPS Point</span>,
  },
  {
    title: "Address",
    // sorter: true,
    dataIndex: "address",
    
  },
  {
    title: "Sim Card Expiration",
    // sorter: true,
    dataIndex: "simExpirationTime",
    render: (value) => <Tag>{value}</Tag>
  },
  {
    title: "Start Time",
    // sorter: true,
    dataIndex: "activate",
    render: (value) => <Tag>{value}</Tag>
  },
  {
    title: "End Time",
    // sorter: true,
    dataIndex: "deactivate",
    render: (value) => <Tag>{value}</Tag>
  },
  {
    title: "Remark",
    dataIndex: "remark",
  },
  {
    title: "Actions",
    dataIndex: "eventId",
    sorter: false,
    width: 130,
    fixed: "right",
    render(_, event) {
      return <Link onClick={() => onProcess(event)}>Site Info</Link>;
    },
  },
];
