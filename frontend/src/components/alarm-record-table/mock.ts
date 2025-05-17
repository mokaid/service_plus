import { DeviceEvent } from "@/types/device-event";

export const data: DeviceEvent[] = [
  {
    eventId: 1,
    site: { id: "00020002", name: "123" },
    vendor: "exacqVision",
    obj: {
      id: "1437097506a56f192914a83c0d8ba3cd",
      name: "http://172.16.100.215",
      key: "ServerResponding",
      value: "Server Not Responding",
      desc: "",
    },
    timeEvent: "2022-07-11 06:37:12",
    timeServer: "2022-07-11 06:37:12",
    timeZone: 0,
    problem: 1,
    level: 5,
    process: { status: 2, time: "2022-07-12 05:05:23" },
    longitude: undefined,
    latitude: undefined,
    systemId: "",
    objId: "",
    siteId: ""
  },
];
