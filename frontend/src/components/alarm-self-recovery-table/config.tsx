import { Divider, Space, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { DeviceEvent } from "@/types/device-event";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = ({
  onProcess,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Site ID",
    dataIndex: "id",
    width: 350,
    sorter: true,
  },
  {
    title: "Site",
    dataIndex: "name",
    width: 350,
    sorter: true,
  },
  {
    title: "Quick Recovery Count",
    dataIndex: "count",
    width: 350,
    sorter: true,
  },

  {
    title: "Actions",
    dataIndex: "eventId",
    sorter: false,
    width: 100,
    // fixed: "right",
    render(_, event) {
      return (
        <Space size={2} split={<Divider type="vertical" />}>
          <Link onClick={() => onProcess(event)}>Open</Link>
        </Space>
      );
    },
  },
];
