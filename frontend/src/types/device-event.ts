import type { ALARM_LEVEL_MAP, AlarmLevelName } from "../const/alarm";

import type { OrganisationSite } from "./organisation";

export type DeviceEvent = {
  longitude: any;
  latitude: any;
  eventId: number;
  site: Pick<OrganisationSite, "id" | "name">;
  vendor: string;
  obj: DeviceEventObject;
  systemId: number | string;
  objId: string;
  siteId: string;
  /**
   * YYYY-MM-DD HH:MM:SS
   */
  timeEvent: string;
  /**
   * YYYY-MM-DD HH:MM:SS
   */
  timeServer: string;
  timeZone: number;
  problem: number;
  level: AlarmLevel;
  process: {
    status: ProcessStatus;
    /**
     * YYYY-MM-DD HH:MM:SS
     */
    time: string;
    caseNum?: string;
    remark?: string;
  };
};

type DeviceEventObject = {
  id: string;
  name: string;
  keyId?: number;
  key: string;
  value: string;
  desc?: string;
};

export enum ProcessStatus {
  Pending = 0,
  Dispatched = 1,
  Accomplished = 2,
}

export type ReqDeviceEvent = {
  pageSize?: number;
  startTime?: string;
  endTime?: string;
  startNum?: number;
  processed?: number;
  sites?: string[] | undefined;
  vendors?: [];
  itemKeys?: [];
  itemLevels?: number[];
  keyword?: string;
  orderBy?: number;
  pageIndex?: number;
};

export type ReqQueryBySite = {
  startTime: string;
  endTime: string;
  processed?: number;
  top?: [];
};

export type AlarmLevel =
  (typeof ALARM_LEVEL_MAP)[AlarmLevelName] extends readonly [...infer A]
    ? A extends Array<infer L>
      ? L
      : never
    : never;
