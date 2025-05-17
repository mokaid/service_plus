import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { AlarmLevel, DeviceEvent } from "@/types/device-event";
import { getFormattedDateTime } from "@/utils/get-formatted-date-time";
import { AlarmLevelTag } from "../alarm-level-tag";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = ({
  onProcess,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Priority",
    sorter: true,
    dataIndex: "level",
    width: 130,
    render: (level: AlarmLevel) => <AlarmLevelTag level={level} />,
  },
  {
    title: "Site",
    sorter: true,
    dataIndex: ["site", "name"],
  },
  {
    title: "Time",
    sorter: true,
    dataIndex: "timeEvent",
    width: 192,
    render: (date: string) => getFormattedDateTime(date),
  },
  {
    title: "System",
    sorter: true,
    dataIndex: "vendor",
  },
  {
    title: "Device",
    sorter: true,
    dataIndex: ["obj", "name"],
  },
  {
    title: "Event Type",
    sorter: true,
    dataIndex: ["obj", "key"],
  },

  {
    title: "Actions",
    dataIndex: "eventId",
    sorter: false,
    width: 130,
    fixed: "right",
    render(_, event) {
      return <Link onClick={() => onProcess(event)}>Acknowledge</Link>;
    },
  },
];
