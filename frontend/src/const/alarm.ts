export enum AlarmLevelName {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export const ALARM_LEVEL_MAP = {
  [AlarmLevelName.Low]: [0, 1],
  [AlarmLevelName.Medium]: [2, 3],
  [AlarmLevelName.High]: [4, 5],
} as const;

export const ALARM_LEVEL_NAME_MAP: Record<AlarmLevelName, string> = {
  [AlarmLevelName.Low]: "Low",
  [AlarmLevelName.Medium]: "Medium",
  [AlarmLevelName.High]: "High",
};
export const Status_LEVEL_NAME_MAP: Record<AlarmLevelName, string> = {
  [AlarmLevelName.Low]: "Connected",
  [AlarmLevelName.Medium]: "Medium",
  [AlarmLevelName.High]: "Disconnected",
};

export const ALARM_LEVEL_OPTIONS = Object.values(AlarmLevelName).map(
  (level) => ({
    label: ALARM_LEVEL_NAME_MAP[level],
    value: ALARM_LEVEL_MAP[level],
  }),
);
