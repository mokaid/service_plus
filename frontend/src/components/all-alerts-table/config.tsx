import { Divider, Space, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import {
  ProcessStatus,
  type AlarmLevel,
  type DeviceEvent,
} from "@/types/device-event";
import { getFormattedDateTime } from "@/utils/get-formatted-date-time";
import { AlarmLevelTag } from "../alarm-level-tag";
import { PermissionGuard } from "../permission-guard";
import Status from "./Status";

const { Link } = Typography;

type ColumnParams = {
  onMark: (event: DeviceEvent) => void;
  onProcess: (event: DeviceEvent) => void;
  recordTable?: boolean;
};

export const generateColumns = ({
  onMark,
  onProcess,
  recordTable,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Priority",
    dataIndex: "level",
    width: 100,
    sorter: (a, b) => {
      return a.level - b.level;
    },
    render: (level: AlarmLevel) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {" "}
        <AlarmLevelTag level={level} />
      </div>
    ),
  },
  {
    title: "Site",
    dataIndex: ["site", "name"],
    width: 155,
    sorter: (a, b) => {
      return a.site.name.length - b.site.name.length;
    },
  },
  {
    title: "Time",
    dataIndex: "timeEvent",
    width: 152,
    render: (date: string) => getFormattedDateTime(date),
    sorter: (a, b) => {
      return a.timeEvent.localeCompare(b.timeEvent);
    },
  },
  // Data Needs to be Checked
  {
    title: "System",
    dataIndex: "vendor",
    width: 105,
    sorter: (a, b) => a.vendor.length - b.vendor.length,
  },
  {
    title: "Device",
    dataIndex: ["obj", "name"],
    width: 140,
    sorter: (a, b) => a.obj.name.length - b.obj.name.length,
  },
  {
    title: "Event Type",
    dataIndex: ["obj", "key"],
    width: 130,
    sorter: (a, b) => a.obj.key.length - b.obj.key.length,
  },
  {
    title: recordTable ? "Status" : null,
    dataIndex: ["process", "status"],
    width: recordTable ? 110 : 0,
    sorter: (a, b) => a.process.status - b.process.status,
    render: (level: number) =>
      recordTable ? (
        <Status status={level} />
      ) : // <div style={{}}>
      //   <p>
      //     {level === 0
      //       ? "Pending"
      //       : level === 1
      //       ? "Dispatched"
      //       : "Accomplished"}
      //   </p>
      // </div>
      null,
  },

  {
    title: "Event Desc",
    dataIndex: ["obj", "value"],
    width: 130,
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
          <PermissionGuard action="m" keyName="record">
            <Link onClick={() => onMark(event)}>Clear</Link>
          </PermissionGuard>
          <PermissionGuard action="m" keyName="record">
            <Link onClick={() => onProcess(event)}>Acknowledge</Link>
          </PermissionGuard>
        </Space>
      );
    },
  },
];
