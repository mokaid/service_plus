/* eslint-disable */
import { Button, Col, Row } from "antd";
import { useContext, useEffect, useMemo, useState, type FC } from "react";

// ICONS
import ClosedTickets from "@/assets/closedTickets.svg?react";
import OpenTickets from "@/assets/openTickets.svg?react";
import SuccessRate from "@/assets/successRate.svg?react";

import { AllAlerts } from "@/components/all-alerts";
import { AlertsByPriority } from "@/widgets/alerts-by-priority";
import { AlertsMap } from "@/widgets/alerts-map";
import { TopAlertsBySite } from "@/widgets/top-alerts-by-site";

import {
  useGetChartEventsCountOfOfflineHistroyMutation,
  useGetChartEventsCountsByStatusMutation,
  useGetChartEventsResponseTimeMutation,
  useGetChartSiteSystemObjectCountMutation,
  useGetEventTopDataMutation,
  useGetSingleUserPermissionMutation,
  useGetUserAllowedSitesMutation,
  useQueryEventsMutation,
} from "@/services";
import styles from "./index.module.css";

import { BaseAreaChart } from "@/charts/area-chart";
import {
  getOfflineSystemsCount,
  getSelectedSiteOfflineSystemsCount,
  getTotalSystemsCount,
  splitName,
} from "@/components/navigation/utils";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setShowEventsFilterModal } from "@/store/slices/events";
import { setShowDateFilter } from "@/store/slices/sites";
import { ThemeContext } from "@/theme";
import {
  HorizontalBarGraphDataType,
  PieGraphDataType,
} from "@/types/graph-data";
import { RootState } from "@/types/store";
import {
  dangerChartColors,
  priorityChartColors,
  siteChartBarColor,
  systemChartColors,
  weeklyAlertChartBarColor,
} from "@/utils/constants";
import {
  formatDate,
  getLastDay,
  getLastMonthDate,
  getLastWeekDate,
} from "@/utils/general-helpers";
import { StatisticCard } from "@/widgets/statistic-card";
import { FilterOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/hooks/use-app-selector";
import { setUserCredentials } from "@/store/slices/authSlice";
import { decodeBase64 } from "@/utils/decodeBase64";

export type ChartDataType = {
  name: string;
  seconds: number;
  avgSecond?: number;
};

export const Dashboard: FC = () => {
  const dispatch = useAppDispatch();

  const [allWeeklyAlerts, setAllWeeklyAlerts] = useState<
    HorizontalBarGraphDataType[]
  >([]);

  const [offLine24Hours, setOffline24Hours] = useState<PieGraphDataType[]>([]);
  const [offline7Days, setOffline7Days] = useState<PieGraphDataType[]>([]);
  const [offline30Days, setOffline30Days] = useState<PieGraphDataType[]>([]);
  const [allowedSites, setAllowedSites] = useState<string[]>([]);
  const [retry, setRetry] = useState<boolean>(false);

  const [top10WeeklyAlertsBySite, setTop10WeeklyAlertsBySite] = useState<
    HorizontalBarGraphDataType[]
  >([]);
  const [weeklyAlertsBySystem, setWeeklyAlertsBySystem] = useState<
    PieGraphDataType[]
  >([]);

  const [weeklyAlertsbyPriority, setWeeklyAlertsbyPriority] = useState<
    PieGraphDataType[]
  >([]);

  const [selectedSiteId, setSelectecSiteId] = useState<string>("");

  const [refetch, setRefetch] = useState<boolean>(false);

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const filters = useSelector((state: RootState) => state.filters);
  const site = useSelector((state: RootState) => state.sites);

  const user = useAppSelector((state: RootState) => state.authState.user);
  const token = useAppSelector((state: RootState) => state.authState.token);

  //USERS PERMISSIONS
  const [
    getSingleUserPermission,
    { data: userPermissionData, isLoading: singleUserPermissionLoader },
  ] = useGetSingleUserPermissionMutation();

  const handleUserPermission = async () => {
    const res = await getSingleUserPermission({ userGuid: user?.userGuid });

    if ("data" in res && res.data) {
      dispatch(
        setUserCredentials({
          user: {
            ...user,
            userGuid: user?.userGuid || "",
            loginType: user?.loginType ?? 0,
            userName: user?.userName || "",
            nickName: user?.nickName || "",
            filter: user?.filter || "",
            // role: user?.role ?? 0,
            role: res?.data?.user?.sysRole,
            sysRole: res?.data?.user?.sysRole,
            status: user?.status ?? 1,
            remark: user?.remark || "",
            creation: user?.creation || {
              time: "",
              userGuid: "",
              userName: "",
              nickName: "",
            },
            permission: res.data?.user?.permission,
          },
          token: token,
        }),
      );
    }
  };

  //USER ALLOWED SITES
  const [getUserAllowedSites, { isLoading: allowedSitesLoadaer }] =
    useGetUserAllowedSitesMutation();

  const handleAllowedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });
    if ("data" in res && res.data) {
      const sitesArray = await (res?.data?.filter || [])?.filter(
        (item: any) => {
          return item.orgId.length > 3;
        },
      );

      const selectedOrgId = await (res?.data?.filter || [])?.find(
        (item: any) => {
          return item.orgId.length <= 3;
        },
      );

      let splitOrgId: string;
      if (selectedOrgId?.orgId.split("0").length > 2) {
        splitOrgId = selectedOrgId?.orgId.split("0")[2];
      } else {
        splitOrgId = selectedOrgId?.orgId.split("0")[1];
      }

      setAllowedSites(
        (sitesArray || []).map((item: any) => {
          const siteId = item?.orgId.split(`${splitOrgId}00`)[1];

          if (siteId.length > 2) {
            return `${selectedOrgId?.orgId}00${siteId}`;
          } else {
            return `0${selectedOrgId?.orgId}00${siteId}`;
          }
        }),
      );
    }
  };

  useEffect(() => {
    handleUserPermission();
    handleAllowedSites();
  }, []);

  // EVENTS
  const [getEvents] = useQueryEventsMutation();
  const [events, setEvents] = useState<any>(null);
  const [mapLoader, setMapLoader] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetchEvents = async () => {
      if (firstLoad) setMapLoader(true);
      const res = await getEvents({
        ...filters,
        pageSize: 50,
        pageIndex: 1,
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data) !== JSON.stringify(prevData)) {
          setEvents(res.data);
          setMapLoader(false);
          prevData = res.data;
        } else if (firstLoad) {
          setMapLoader(false);
        }
      }
      firstLoad = false;
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filters, allowedSites]);

  // CHART EVENT COUNT OFFLINE HISTORY (24h, 7d, 30d)
  const [getChartEventCountOfflineHistory] =
    useGetChartEventsCountOfOfflineHistroyMutation();
  const [eventCountOfflineHistoryLoader, setEventCountOfflineHistoryLoader] =
    useState(true);

  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetch24h = async () => {
      if (firstLoad) setEventCountOfflineHistoryLoader(true);
      const res = await getChartEventCountOfflineHistory({
        ...filters,
        startTime: formatDate(getLastDay(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 1,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data) !== JSON.stringify(prevData)) {
          setOffline24Hours(res.data.data || []);
          setEventCountOfflineHistoryLoader(false);
          prevData = res.data.data;
        } else if (firstLoad) {
          setEventCountOfflineHistoryLoader(false);
        }
      }
      firstLoad = false;
    };
    fetch24h();
    const interval = setInterval(fetch24h, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filters, allowedSites]);

  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetch7d = async () => {
      if (firstLoad) setEventCountOfflineHistoryLoader(true);
      const res = await getChartEventCountOfflineHistory({
        ...filters,
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 1,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data) !== JSON.stringify(prevData)) {
          setOffline7Days(res.data.data || []);
          setEventCountOfflineHistoryLoader(false);
          prevData = res.data.data;
        } else if (firstLoad) {
          setEventCountOfflineHistoryLoader(false);
        }
      }
      firstLoad = false;
    };
    fetch7d();
    const interval = setInterval(fetch7d, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filters, allowedSites]);

  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetch30d = async () => {
      if (firstLoad) setEventCountOfflineHistoryLoader(true);
      const res = await getChartEventCountOfflineHistory({
        ...filters,
        startTime: formatDate(getLastMonthDate(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 1,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data) !== JSON.stringify(prevData)) {
          setOffline30Days(res.data.data || []);
          setEventCountOfflineHistoryLoader(false);
          prevData = res.data.data;
        } else if (firstLoad) {
          setEventCountOfflineHistoryLoader(false);
        }
      }
      firstLoad = false;
    };
    fetch30d();
    const interval = setInterval(fetch30d, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filters, allowedSites]);

  // CHART EVENT COUNT BY STATUS
  const [getChartEventCountbyStatus] =
    useGetChartEventsCountsByStatusMutation();
  const [chartEventStatusData, setChartEventStatusData] = useState<any>(null);
  const [chartEventStatusLoader, setChartEventStatusLoader] = useState(true);
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetchStatus = async () => {
      if (firstLoad) setChartEventStatusLoader(true);
      const res = await getChartEventCountbyStatus({
        ...filters,
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data) !== JSON.stringify(prevData)) {
          setChartEventStatusData(res.data);
          setChartEventStatusLoader(false);
          prevData = res.data;
        } else if (firstLoad) {
          setChartEventStatusLoader(false);
        }
      }
      firstLoad = false;
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filters, allowedSites, refetch]);

  // CHART SITE SYSTEM OBJECT COUNT
  const [getChartSiteSystemObjectCount] =
    useGetChartSiteSystemObjectCountMutation();
  const [siteSystemObjectCount, setSiteSystemObjectCount] = useState<any>(null);
  const [siteSystemCountLoader, setSiteSystemCountLoader] = useState(true);
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetchSystemCount = async () => {
      if (firstLoad) setSiteSystemCountLoader(true);

      const res = await getChartSiteSystemObjectCount({
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
      });
      if (!isMounted) return;
      if ((res as any)?.data?.error === 0) {
        if (JSON.stringify((res as any).data) !== JSON.stringify(prevData)) {
          setSiteSystemObjectCount((res as any).data);
          setSiteSystemCountLoader(false);
          prevData = (res as any).data;
        } else if (firstLoad) {
          setSiteSystemCountLoader(false);
        }
      } else {
        setRetry(true);
      }
      firstLoad = false;
    };
    fetchSystemCount();
    const interval = setInterval(fetchSystemCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [allowedSites, retry, filters]);

  // CHART EVENTS RESPONSE TIME
  const [getChartEventsReponseTime] = useGetChartEventsResponseTimeMutation();
  const [eventReponseTimeChartData, setEventReponseTimeChartData] =
    useState<any>(null);
  const [eventReponseTimeLoader, setEventReponseTimeLoader] = useState(true);
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetchResponseTime = async () => {
      if (firstLoad) setEventReponseTimeLoader(true);
      const res = await getChartEventsReponseTime({
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        sites: selectedSiteId ? [selectedSiteId] : allowedSites,
        vendors: [],
        objIds: [],
        itemKeys: [],
        itemLevels: [],
        groupBy: 0,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data) !== JSON.stringify(prevData)) {
          setEventReponseTimeChartData(res.data);
          setEventReponseTimeLoader(false);
          prevData = res.data;
        } else if (firstLoad) {
          setEventReponseTimeLoader(false);
        }
      }
      firstLoad = false;
    };
    fetchResponseTime();
    const interval = setInterval(fetchResponseTime, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedSiteId, allowedSites, refetch]);

  // EVENT TOP DATA (all weekly, by site, by system, by priority)
  const [getChartTop10Events] = useGetEventTopDataMutation();
  const [chartTop10EventsLoader, setChartTop10EventsLoader] = useState(true);

  const getAlertsForAllUsers = async () => {
    return await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      sites: filters.sites.length > 0 ? filters.sites : allowedSites,
      groupBy: 5,
    });
  };

  const handleAllowedSitesForWeeklyALertsOfCustomer = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });

    if ("data" in res) {
      const currentData = await getAlertsForAllUsers();
      const filteredSites: any[] = [];
      (currentData as any)?.data?.data?.data?.forEach((item: any) => {
        const splittedId = item?.name.split(" ")[0];
        res?.data?.filter?.forEach((sites: any) => {
          const splittedValue = sites.orgId.split("0")[0];
          let newSiteId;
          if (splittedValue.length === 2) {
            newSiteId = `0${sites?.orgId}`;
          } else {
            newSiteId = `00${sites?.orgId}`;
          }

          if (newSiteId) {
            if (newSiteId === splittedId) {
              filteredSites.push(item);
            } else {
              return;
            }
          }
        });
      });

      setAllWeeklyAlerts(filteredSites);
    }
  };

  // All Weekly Alerts
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;

    getAlertsForAllUsers();

    const fetchAllWeeklyAlerts = async () => {
      if (firstLoad) setChartTop10EventsLoader(true);
      const res = await getChartTop10Events({
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 5,
        top: 50,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data?.data) !== JSON.stringify(prevData)) {
          setAllWeeklyAlerts(
            res.data.data?.data.map((item: any) => {
              return {
                count: item.count,
                name: splitName(item.name)
                  ?.filter((_, index) => index > 0)
                  .join(" "),
              };
            }) || [],
          );
          setChartTop10EventsLoader(false);
          prevData = res.data.data?.data;
        } else if (firstLoad) {
          setChartTop10EventsLoader(false);
        }
      }
      firstLoad = false;
    };

    if (user?.role === 99 && user?.permission) {
      handleAllowedSitesForWeeklyALertsOfCustomer();
    } else {
      fetchAllWeeklyAlerts();
    }
    const interval = setInterval(
      user?.role === 99 && user?.permission
        ? handleAllowedSitesForWeeklyALertsOfCustomer
        : fetchAllWeeklyAlerts,
      30000,
    );
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, allowedSites, filters]);

  // Top 10 Weekly Alerts By Site

  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;

    const fetchTop10WeeklyAlertsBySite = async () => {
      if (firstLoad) setChartTop10EventsLoader(true);
      const res = await getChartTop10Events({
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 1,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data?.data) !== JSON.stringify(prevData)) {
          setTop10WeeklyAlertsBySite(res.data.data?.data || []);
          setChartTop10EventsLoader(false);
          prevData = res.data.data?.data;
        } else if (firstLoad) {
          setChartTop10EventsLoader(false);
        }
      }
      firstLoad = false;
    };

    fetchTop10WeeklyAlertsBySite();

    const interval = setInterval(fetchTop10WeeklyAlertsBySite, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [allowedSites, filters]);

  // Weekly Alerts By System
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetchWeeklyAlertsBySystem = async () => {
      if (firstLoad) setChartTop10EventsLoader(true);
      const res = await getChartTop10Events({
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 3,
        top: 50,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data?.data) !== JSON.stringify(prevData)) {
          setWeeklyAlertsBySystem(res.data.data?.data || []);
          setChartTop10EventsLoader(false);
          prevData = res.data.data?.data;
        } else if (firstLoad) {
          setChartTop10EventsLoader(false);
        }
      }
      firstLoad = false;
    };
    fetchWeeklyAlertsBySystem();
    const interval = setInterval(fetchWeeklyAlertsBySystem, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [allowedSites, filters]);

  // Weekly Alerts By Priority
  useEffect(() => {
    let isMounted = true;
    let firstLoad = true;
    let prevData: any = null;
    const fetchWeeklyAlertsByPriority = async () => {
      if (firstLoad) setChartTop10EventsLoader(true);
      const res = await getChartTop10Events({
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        sites: filters.sites.length > 0 ? filters.sites : allowedSites,
        groupBy: 4,
        top: 50,
      });
      if (!isMounted) return;
      if ("data" in res) {
        if (JSON.stringify(res.data.data?.data) !== JSON.stringify(prevData)) {
          setWeeklyAlertsbyPriority(res.data.data?.data || []);
          setChartTop10EventsLoader(false);
          prevData = res.data.data?.data;
        } else if (firstLoad) {
          setChartTop10EventsLoader(false);
        }
      }
      firstLoad = false;
    };
    fetchWeeklyAlertsByPriority();
    const interval = setInterval(fetchWeeklyAlertsByPriority, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [allowedSites, filters]);

  const openAlarmTickets = useMemo(() => {
    const openCount = chartEventStatusData?.event?.find(
      (item: { processed: number; count: number }) => {
        return item.processed === 0;
      },
    );
    return openCount ? openCount : 0;
  }, [chartEventStatusData, site]);

  const closedAlarmTickets = useMemo(() => {
    const closedCount = chartEventStatusData?.event?.find(
      (item: { processed: number; count: number }) => {
        return item.processed === 99;
      },
    );
    return closedCount ? closedCount : 0;
  }, [chartEventStatusData, site]);

  const eventResponseTimeData = useMemo(() => {
    return eventReponseTimeChartData?.process?.map((item: ChartDataType) => {
      return {
        name: splitName(item.name)
          ?.filter((_, index) => index > 0)
          .join(" "),
        seconds: item.avgSecond ?? item.seconds,
      };
    });
  }, [eventReponseTimeChartData]);

  const eventRectificationTimeData = useMemo(() => {
    return eventReponseTimeChartData?.response?.map((item: ChartDataType) => {
      return {
        name: splitName(item.name)
          ?.filter((_, index) => index > 0)
          .join(" "),
        seconds: item.avgSecond ?? item.seconds,
      };
    });
  }, [eventReponseTimeChartData]);

  const weeklyPriorityData = useMemo(() => {
    const weeklyPriorityArray: any[] = [];
    const lowPriority = weeklyAlertsbyPriority?.filter((item) => {
      return item.name === "0" || item.name === "1";
    });

    const mediumPriority = weeklyAlertsbyPriority?.filter((item) => {
      return item.name === "2" || item.name === "3";
    });
    const highPriority = weeklyAlertsbyPriority?.filter((item) => {
      return item.name === "4" || item.name === "5";
    });

    const lowArray = {
      name: "Low",
      count: lowPriority?.reduce((total, item) => {
        return total + (item?.count ?? 0);
      }, 0),
    };

    const mediumArray = {
      name: "Medium",
      count: mediumPriority?.reduce((total, item) => {
        return total + (item?.count ?? 0);
      }, 0),
    };

    const highArray = {
      name: "High",
      count: highPriority?.reduce((total, item) => {
        return total + (item?.count ?? 0);
      }, 0),
    };

    weeklyPriorityArray?.push(lowArray, mediumArray, highArray);
    return weeklyPriorityArray;
  }, [weeklyAlertsbyPriority]);

  const handleSetSiteId = async () => {
    const siteId = splitName(site.selectedSite as string);
    setSelectecSiteId(siteId[0]);
  };

  useEffect(() => {
    handleSetSiteId();
    // Only call getChartSiteSystemObjectCount, others are handled by polling
    getChartSiteSystemObjectCount({
      sites: filters.sites.length > 0 ? filters.sites : allowedSites,
    });
  }, [site, filters, allowedSites]);

  const selectedSiteOfflineData = getSelectedSiteOfflineSystemsCount(
    siteSystemObjectCount?.site?.filter((item: any) => {
      return item.siteId === selectedSiteId;
    }),
  );

  const offlineSystems = selectedSiteId
    ? selectedSiteOfflineData
    : getOfflineSystemsCount(siteSystemObjectCount);

  const totalOfflineSystems = useMemo(() => {
    return Object.values(offlineSystems).reduce((total, item) => {
      return Number(total) + Number(item);
    }, 0);
  }, [offlineSystems, selectedSiteId, allowedSites]);

  const OfflineSystemsData = useMemo((): PieGraphDataType[] => {
    const count = Object.values(offlineSystems);
    const names = Object.keys(offlineSystems);
    return count?.map((item: any, index: number) => {
      return {
        name: names[index],
        value: Number(item),
        count: Number(item),
      };
    });
  }, [offlineSystems, selectedSiteId, allowedSites]);

  const totalAssetsCount = getTotalSystemsCount(siteSystemObjectCount);

  const totalAssets = useMemo(() => {
    return Object.values(totalAssetsCount).reduce((total, item) => {
      return Number(total) + Number(item);
    }, 0);
  }, [totalAssetsCount]);

  const totalAssetsData = useMemo((): PieGraphDataType[] => {
    const count = Object.values(totalAssetsCount);
    const names = Object.keys(totalAssetsCount);
    return count?.map((item: any, index: number) => {
      return {
        name: names[index],
        value: Number(item),
        count: Number(item), // Added count property to match PieGraphDataType
      };
    });
  }, [totalAssetsCount]);

  const handleFilterClick = () => {
    dispatch(setShowEventsFilterModal(true));
    dispatch(setShowDateFilter(false));
  };

  const successRate = useMemo(() => {
    return closedAlarmTickets?.count
      ? Math.ceil(
          ((closedAlarmTickets?.count || 0) /
            ((openAlarmTickets?.count || 0) +
              (closedAlarmTickets?.count || 0))) *
            100,
        )
      : 0;
  }, [closedAlarmTickets, openAlarmTickets, chartEventStatusData]);

  return (
    <Row gutter={[24, 24]}>
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        <p
          style={{
            fontSize: 32,
            color: "white",
            fontWeight: 700,
            lineHeight: "48px",
          }}
        >
          Dashboard
        </p>

        <Button
          className={`filter_btn ${darkTheme ? "filter_btn_bg" : ""}`}
          icon={<FilterOutlined />}
          onClick={handleFilterClick}
        >
          Filter
        </Button>
      </Row>

      <Col
        span={24}
        style={{
          marginTop: "-35px",
        }}
      >
        <AlertsMap
          isLoading={mapLoader}
          data={events ? events?.data?.event : []}
          dataTestId="alerts-map"
          selectedSite={site.selectedSite ? site.selectedSite : ""}
          setSelectedSiteId={setSelectecSiteId}
        />
      </Col>

      {/* Statistic Cards */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <StatisticCard
              title="Open Tickets"
              loading={chartEventStatusLoader}
              icon={<OpenTickets />}
              value={openAlarmTickets?.count ? openAlarmTickets?.count : 0}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Closed Tickets"
              loading={chartEventStatusLoader}
              icon={<ClosedTickets />}
              value={closedAlarmTickets?.count ? closedAlarmTickets?.count : 0}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Success Rate"
              loading={chartEventStatusLoader}
              icon={<SuccessRate />}
              value={`${successRate}%`}
            />
          </Col>
        </Row>
      </Col>

      {/* Total Assets & Response/Rectification Time */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <AlertsByPriority
              title="Total Assets"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalAssets?.toString()}
              data={
                totalAssetsData?.sort((a, b) => {
                  return b.value - a.value;
                }) || []
              }
              isLoading={siteSystemCountLoader}
              // legend={false}
              colors={priorityChartColors}
            />
          </Col>

          <Col span={8}>
            <BaseAreaChart
              stroke="#52C41A"
              colors={["#52C41A"]}
              fill="#308009"
              title="Response Time"
              data={eventResponseTimeData || []}
              dataKey={eventReponseTimeChartData?.process?.map((item: any) => {
                return item?.id;
              })}
              height={250}
              width={400}
              isLoading={eventReponseTimeLoader}
            />
          </Col>

          <Col span={8}>
            <BaseAreaChart
              stroke="#40A9FF"
              colors={["#40A9FF"]}
              fill="#40A9FF"
              title="Recification Time"
              dataKey={eventReponseTimeChartData?.response?.map((item: any) => {
                return item?.id;
              })}
              height={250}
              width={400}
              data={eventRectificationTimeData || []}
              isLoading={eventReponseTimeLoader}
            />
          </Col>
        </Row>
      </Col>

      {/* Offline Assets */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <AlertsByPriority
              title="Offline Assets"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalOfflineSystems?.toString()}
              data={
                OfflineSystemsData?.sort((a, b) => {
                  return b.value - a.value;
                }) || []
              }
              isLoading={siteSystemCountLoader}
              // legend={false}
              colors={dangerChartColors}
              retry={retry}
              setRetry={setRetry}
              refetch={getChartSiteSystemObjectCount}
              selectedSiteId={selectedSiteId}
              allowedSites={allowedSites}
            />
          </Col>

          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 24 Hours"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={offLine24Hours
                ?.reduce((total, item) => {
                  return total + item.count;
                }, 0)
                .toString()}
              data={
                offLine24Hours
                  ?.map((item: any) => ({
                    value: item.count,
                    name: item.name,
                  }))
                  ?.sort((a, b) => {
                    return b.value - a.value;
                  }) || []
              }
              isLoading={eventCountOfflineHistoryLoader}
              legend={true}
              colors={dangerChartColors}
            />
          </Col>

          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 7 Days"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={offline7Days
                ?.reduce((total, item) => {
                  return total + item.count;
                }, 0)
                .toString()}
              data={
                offline7Days
                  ?.map((item: any) => ({
                    value: item.count,
                    name: item.name,
                  }))
                  ?.sort((a, b) => {
                    return b.value - a.value;
                  }) || []
              }
              isLoading={eventCountOfflineHistoryLoader}
              legend={true}
              colors={dangerChartColors}
            />
          </Col>

          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 30 Days"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={offline30Days
                ?.reduce((total, item) => {
                  return total + item.count;
                }, 0)
                .toString()}
              data={
                offline30Days?.map((item: any) => ({
                  value: item.count,
                  name: item.name,
                })) || []
              }
              isLoading={eventCountOfflineHistoryLoader}
              legend={true}
              colors={dangerChartColors}
              refetch={getChartEventCountOfflineHistory}
            />
          </Col>
        </Row>
      </Col>

      <Col span={6}>
        <TopAlertsBySite
          title="All Weekly Alerts"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="all-weekly-alerts"
          color={weeklyAlertChartBarColor}
          data={allWeeklyAlerts}
          isLoading={chartTop10EventsLoader}
        />
      </Col>

      <Col span={6}>
        <AlertsByPriority
          title="Weekly Alerts by Priority"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-priority-alerts-chart"
          centerText={weeklyAlertsbyPriority?.length.toString()}
          data={
            weeklyPriorityData
              ?.map((item: any) => ({
                value: item.count,
                name: item.name,
              }))
              ?.sort((a, b) => {
                return b.value - a.value;
              }) || []
          }
          isLoading={chartTop10EventsLoader}
          colors={priorityChartColors}
        />
      </Col>

      <Col span={6} className="overflow-scroll h-100">
        <AlertsByPriority
          title="Weekly Alerts by System"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget}  ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-alerts-by-system"
          centerText={weeklyAlertsBySystem?.length.toString()}
          data={
            weeklyAlertsBySystem
              ?.map((item: any) => ({
                value: item.count,
                name: item.name,
              }))
              ?.sort((a, b) => {
                return b.value - a.value;
              }) || []
          }
          isLoading={chartTop10EventsLoader}
          colors={
            weeklyAlertsBySystem?.length <= systemChartColors?.length
              ? systemChartColors
              : systemChartColors
          }
        />
      </Col>

      <Col span={6}>
        <TopAlertsBySite
          title="Top 10 Weekly Alerts by Site"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="top-10-alerts-by-site-chart"
          color={siteChartBarColor}
          data={top10WeeklyAlertsBySite}
          isLoading={chartTop10EventsLoader}
        />
      </Col>

      <Col span={24}>
        <AllAlerts setRefetch={setRefetch} />
      </Col>
    </Row>
  );
};
