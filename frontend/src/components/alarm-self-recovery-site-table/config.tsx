import { Divider, Space, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { AlarmLevel, DeviceEvent } from "@/types/device-event";
import { getFormattedDateTime } from "@/utils/get-formatted-date-time";
import { AlarmLevelTag } from "../alarm-level-tag";

const { Link } = Typography;

type ColumnParams = {
  onMark: (event: DeviceEvent) => void;
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = ({
  onMark,
  onProcess,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Priority",
    dataIndex: "level",
    width: 100,
    sorter: (a, b) =>{return( a.level - b.level)},
    render: (level: AlarmLevel) =><div style={{display:"flex",justifyContent:"center"}}> <AlarmLevelTag level={level} /></div>,
  },
  {
    title: "Site",
    dataIndex: ["site", "name"],
    width: 250,
    sorter: (a, b) =>{ return( a.site.name.length - b.site.name.length)},
  },
  {
    title: "Time",
    dataIndex: "timeEvent",
    width: 192,
    render: (date: string) => getFormattedDateTime(date),
    sorter: (a, b) => {
      return a.timeEvent.localeCompare(b.timeEvent);
    },
  },
  // Data Needs to be Checked
  {
    title: "System",
    dataIndex: "vendor",
    width: 144,
    sorter: (a, b) => a.vendor.length - b.vendor.length,
  },
  {
    title: "Device",
    dataIndex: ["obj", "name"],
    width: 239,
    sorter: (a, b) => a.obj.name.length - b.obj.name.length,
  },
  {
    title: "Event Type",
    dataIndex: ["obj", "key"],
    width: 300,
    sorter: (a, b) => a.obj.key.length - b.obj.key.length,
  },
  {
    title: "Event Desc",
    dataIndex: ["obj", "value"],
    width: 300,
    sorter: (a, b) => a.obj.value.length - b.obj.value.length,
  },
  {
    title: "Actions",
    dataIndex: "eventId",
    sorter: false,
    width: 190,
    fixed: "right",
    render(_, event) {
      return (
        <Space size={2} split={<Divider type="vertical" />}>
          <Link onClick={()=>onMark(event)}>Clear</Link>
          <Link onClick={() => onProcess(event)}>Acknowledge</Link>
        </Space>
      );
    },
  },
];
