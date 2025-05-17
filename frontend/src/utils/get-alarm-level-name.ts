import { ALARM_LEVEL_MAP, AlarmLevelName } from "../const/alarm";
import type { AlarmLevel } from "../types/device-event";

export function getAlarmLevelName(level: AlarmLevel): AlarmLevelName {
  let levelName = AlarmLevelName.High;

  (
    Object.entries(ALARM_LEVEL_MAP) as [AlarmLevelName, readonly AlarmLevel[]][]
  ).forEach(([name, levels]) => {
    if (levels.includes(level)) {
      levelName = name;
    }
  });

  return levelName;
}
