import type { FC } from "react";
import { Tag } from "antd";

import { ALARM_LEVEL_NAME_MAP } from "@/const/alarm";
import { AlarmLevel } from "@/types/device-event";
import { getAlarmLevelName } from "@/utils/get-alarm-level-name";

type Props = {
  className?: string;
  level: AlarmLevel;
};

const ALARM_LEVEL_COLOR_MAP = {
  low: "success",
  medium: "warning",
  high: "error",
};

export const AlarmLevelTag: FC<Props> = ({ className, level }) => {
  const alarmLevelName = getAlarmLevelName(level);

  return (
    <Tag
      className={className}
      color={ALARM_LEVEL_COLOR_MAP[alarmLevelName]}
      style={{
        borderRadius: "2px",
        border: "1px solid",
        padding: "0px 15px",
        minWidth: "75px",
        textAlign: "center",
      }}
    >
      {ALARM_LEVEL_NAME_MAP[alarmLevelName]}
    </Tag>
  );
};
