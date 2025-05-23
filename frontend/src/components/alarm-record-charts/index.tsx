import { Col, Row } from "antd";
import { useContext, useEffect, useMemo, useState, type FC } from "react";

// ICONS
import ClosedTickets from "@/assets/closedTickets.svg?react";
import OpenTickets from "@/assets/openTickets.svg?react";
import SuccessRate from "@/assets/successRate.svg?react";

import { AlertsByMonth } from "@/widgets/alerts-by-month";
import { AlertsByPriority } from "@/widgets/alerts-by-priority";
import { TopAlertsBySite } from "@/widgets/top-alerts-by-site";

import { BaseAreaChart } from "@/charts/area-chart";
import { ChartDataType } from "@/pages/dashboard";
import {
  useGetChartEventsCountOfOfflineHistroyMutation,
  useGetChartEventsCountsByStatusMutation,
  useGetChartEventsResponseTimeMutation,
  useGetChartSiteSystemObjectCountMutation,
  useGetEventTopDataMutation,
} from "@/services";
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
import { useSelector } from "react-redux";
import {
  getOfflineSystemsCount,
  getTotalDeviceAlerts,
  getTotalSystemsCount,
  splitName,
} from "../navigation/utils";
import styles from "./index.module.css";

export const AlarmRecordCharts: FC = () => {
  const [weeklyAlertsbyPriority, setWeeklyAlertsbyPriority] = useState<
    PieGraphDataType[]
  >([]);
  const [allWeeklyAlerts, setAllWeeklyAlerts] = useState<
    HorizontalBarGraphDataType[]
  >([]);
  const [top10WeeklyAlertsBySite, setTop10WeeklyAlertsBySite] = useState<
    HorizontalBarGraphDataType[]
  >([]);
  const [weeklyAlertsbyDevices, setWeeklyAlertsbyDevices] = useState<
    HorizontalBarGraphDataType[]
  >([]);
  const [weeklyAlertsBySystem, setWeeklyAlertsBySystem] = useState<
    PieGraphDataType[]
  >([]);

  const [offLine24Hours, setOffline24Hours] = useState<PieGraphDataType[]>([]);
  const [offline7Days, setOffline7Days] = useState<PieGraphDataType[]>([]);
  const [offline30Days, setOffline30Days] = useState<PieGraphDataType[]>([]);

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  // const setDataIntoStates = (data: DeviceEvent[]) => {
  //   setTotalWeeklyAlerts(data.length);
  //   const count = {
  //     low: 0,
  //     medium: 0,
  //     high: 0,
  //   };
  //   let vendors: PieGraphDataType[] = [];
  //   let sites: HorizontalBarGraphDataType[] = [];
  //   let weeklyAlerts: HorizontalBarGraphDataType[] = [];

  //   data.forEach((ev: DeviceEvent) => {
  //     // Priority
  //     const alarmLevel = getAlarmLevelName(ev.level);
  //     count[alarmLevel]++;

  //     // Vendors
  //     const findVendor = vendors.find((item) => item.name === ev.vendor);
  //     if (!findVendor) {
  //       vendors.push({ name: ev.vendor, value: 1 });
  //     } else {
  //       const newVendors = vendors.filter((item) => item.name !== ev.vendor);
  //       vendors = [
  //         ...newVendors,
  //         { name: ev.vendor, value: findVendor.value + 1 },
  //       ];
  //     }

  //     // Sites
  //     const findSite = sites.find((item) => item.name === ev.site.name);
  //     if (!findSite) {
  //       sites.push({ name: ev.site.name, count: 1 });
  //     } else {
  //       const newsites = sites.filter((item) => item.name !== ev.site.name);
  //       sites = [
  //         ...newsites,
  //         { name: ev.site.name, count: findSite.count + 1 },
  //       ];
  //     }

  //     const findAlert = weeklyAlerts.find((item) => item.name === ev.obj.value);
  //     if (!findAlert) {
  //       weeklyAlerts.push({ name: ev.obj.value, count: 1 });
  //     } else {
  //       const newweeklyAlerts = weeklyAlerts.filter(
  //         (item) => item.name !== ev.obj.value
  //       );
  //       weeklyAlerts = [
  //         ...newweeklyAlerts,
  //         { name: ev.obj.value, count: findAlert.count + 1 },
  //       ];
  //     }
  //   });
  //   setWeeklyAlertsbyPriority([
  //     { name: "Low", value: count.low },
  //     { name: "Medium", value: count.medium },
  //     { name: "High", value: count.high },
  //   ]);
  //   setWeeklyAlertsbySystem(vendors);
  //   setWeeklyTopAlertsBySite(
  //     sites
  //       .map((item, ind) => ({
  //         ...item,
  //         xAxisValue: Math.ceil((1000 / sites.length) * (ind + 1)),
  //       }))
  //       .sort((a, b) => b.count - a.count)
  //   );
  //   setAllWeeklyAlerts(
  //     weeklyAlerts
  //       .map((item, ind) => ({
  //         ...item,
  //         xAxisValue: Math.ceil((1000 / weeklyAlerts.length) * (ind + 1)),
  //       }))
  //       .sort((a, b) => b.count - a.count)
  //   );
  //   dispatch(setAllEvents(data));
  // };

  // const filters = useSelector((state: RootState) => state.filters);

  // useEffect(() => {
  //   (async () => {
  //     await getAssetsStatistics({
  //       ...filters,
  //       ...{ startTime: formatDate(getLastWeekDate(new Date())) },
  //       ...{ endTime: formatDate(new Date()) },
  //       ...(selectedSite ? { sites: [selectedSite] } : {}),
  //     });
  //   })();
  // }, [selectedSite, filters]);

  // useEffect(() => {
  //   dispatch(
  //     setFilters({
  //       ...filters,
  //       startTime: formatDate(getLastWeekDate(new Date())),
  //       endTime: formatDate(new Date()),
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   if (dashboardStatistics) {
  //     setDataIntoStates(dashboardStatistics?.allAlerts);
  //   }
  // }, [dashboardStatistics]);

  const site = useSelector((state: RootState) => state.sites);

  // New Apis integrated Below

  //Chart Data Events Status
  const [
    getChartEventCountbyStatus,
    { data: ChartEventStatusData, isLoading: ChartEventStatusLoader },
  ] = useGetChartEventsCountsByStatusMutation();

  const openAlarmTickets = useMemo(() => {
    return ChartEventStatusData?.event?.find(
      (item: { processed: number; count: number }) => {
        return item.processed === 0;
      },
    );
  }, [ChartEventStatusData, site]);

  const closedAlarmTickets = useMemo(() => {
    return ChartEventStatusData?.event?.find(
      (item: { processed: number; count: number }) => {
        return item.processed === 99;
      },
    );
  }, [ChartEventStatusData, site]);

  // Chart Site System Object Count
  const [
    getChartSiteSystemObjectCount,
    { data: SiteSystemObjectCount, isLoading: SiteSystemCountLoader },
  ] = useGetChartSiteSystemObjectCountMutation();

  // Total Assets Response and Recification Time
  const totalAssetsCount = getTotalSystemsCount(SiteSystemObjectCount);

  const totalAssets = useMemo(() => {
    return Object.values(totalAssetsCount).reduce((total, item) => {
      return total + item;
    }, 0);
  }, [totalAssetsCount]);

  //Get Chart Event Response Time
  const [
    getChartEventsReponseTime,
    { data: EventReponseTimeChartData, isLoading: EventReponseTimeLoader },
  ] = useGetChartEventsResponseTimeMutation();

  const eventResponseTimeData = useMemo(() => {
    return EventReponseTimeChartData?.process.map((item: ChartDataType) => {
      return {
        name: splitName(item.name)
          .filter((_, index) => index > 0)
          .join(" "),
        seconds: item.avgSecond,
      };
    });
  }, [EventReponseTimeChartData]);

  const eventRectificationTimeData = useMemo(() => {
    return EventReponseTimeChartData?.response.map((item: ChartDataType) => {
      return {
        name: splitName(item.name)
          .filter((_, index) => index > 0)
          .join(" "),
        seconds: item.avgSecond,
      };
    });
  }, [EventReponseTimeChartData]);

  //Chart Event Count Offline History
  const [
    getChartEventCountOfflineHistory,
    { isLoading: EventCountOfflineHistoryLoader },
  ] = useGetChartEventsCountOfOfflineHistroyMutation();

  const eventOfflinePast24Hours = async () => {
    const response = await getChartEventCountOfflineHistory({
      startTime: formatDate(getLastDay(new Date())),
      endTime: formatDate(new Date()),
      // site: selectedSiteId ? [selectedSiteId] : [],
      vendors: [],
      objIds: [],
      itemKeys: [],
      itemLevels: [],
      groupBy: 1,
    });

    if ("data" in response) {
      setOffline24Hours(response.data.data);
    }
  };

  const eventOfflinePast7Days = async () => {
    const response = await getChartEventCountOfflineHistory({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      // site: selectedSiteId ? [selectedSiteId] : [],
      vendors: [],
      objIds: [],
      itemKeys: [],
      itemLevels: [],
      groupBy: 1,
    });

    if ("data" in response) {
      setOffline7Days(response.data.data);
    }
  };

  const eventOfflinePast30Days = async () => {
    const response = await getChartEventCountOfflineHistory({
      startTime: formatDate(getLastMonthDate(new Date())),
      endTime: formatDate(new Date()),
      // site: selectedSiteId ? [selectedSiteId] : [],
      vendors: [],
      objIds: [],
      itemKeys: [],
      itemLevels: [],
      groupBy: 1,
    });

    if ("data" in response) {
      setOffline30Days(response.data.data);
    }
  };

  //Get Event Top Data
  const [
    getChartTop10Events,
    { data: Top10EventsData, isLoading: ChartTop10EventsLoader },
  ] = useGetEventTopDataMutation();

  const getTop10WeeklyAlertsBySite = async () => {
    const response = await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      groupBy: 1,
    });

    if ("data" in response) {
      setTop10WeeklyAlertsBySite(response.data.data.data);
    }
  };

  const getWeeklyAlertsBySystem = async () => {
    const response = await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      groupBy: 3,
      top: 50,
    });

    if ("data" in response) {
      setWeeklyAlertsBySystem(response.data.data.data);
    }
  };

  const getWeeklyAlertsByPriority = async () => {
    const response = await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      groupBy: 4,
      top: 50,
    });

    if ("data" in response) {
      setWeeklyAlertsbyPriority(response.data.data.data);
    }
  };
  const getWeeklyAlertsByDevices = async () => {
    const response = await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      groupBy: 12,
      top: 50,
    });

    if ("data" in response) {
      const deviceData = await getTotalDeviceAlerts(response.data.data.data);
      setWeeklyAlertsbyDevices(deviceData);
    }
  };

  const getAllWeeklyAlerts = async () => {
    const response = await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      groupBy: 5,
      top: 50,
    });

    if ("data" in response) {
      setAllWeeklyAlerts(response.data.data.data);
    }
  };

  const weeklyPriorityData = useMemo(() => {
    const weeklyPriorityArray: any[] = [];
    const lowPriority = weeklyAlertsbyPriority.filter((item) => {
      return item.name === "0" || item.name === "1";
    });

    const mediumPriority = weeklyAlertsbyPriority.filter((item) => {
      return item.name === "2" || item.name === "3";
    });
    const highPriority = weeklyAlertsbyPriority.filter((item) => {
      return item.name === "4" || item.name === "5";
    });

    const lowArray = {
      name: "Low",
      low: "Low",
      count: lowPriority?.reduce((total, item) => {
        return total + item?.count;
      }, 0),
    };

    const mediumArray = {
      name: "Medium",
      medium: "Medium",
      count: mediumPriority.reduce((total, item) => {
        return total + item?.count;
      }, 0),
    };

    const highArray = {
      name: "High",
      high: "High",
      count: highPriority.reduce((total, item) => {
        return total + item?.count;
      }, 0),
    };

    weeklyPriorityArray.push(lowArray, mediumArray, highArray);
    return weeklyPriorityArray;
  }, [weeklyAlertsbyPriority]);

  //Total Assets
  const totalAssetsData = useMemo(() => {
    const count = Object.values(totalAssetsCount);
    const names = Object.keys(totalAssetsCount);

    return count.map((item, index) => {
      return {
        name: names[index],
        value: item,
      };
    });
  }, [totalAssetsCount]);

  //Total Offline Assets
  const offlineSystems = getOfflineSystemsCount(SiteSystemObjectCount);

  const totalOfflineSystems = useMemo(() => {
    return Object.values(offlineSystems).reduce((total, item) => {
      return total + item;
    }, 0);
  }, [offlineSystems]);

  const OfflineSystemsData = useMemo(() => {
    const count = Object.values(offlineSystems);
    const names = Object.keys(offlineSystems);

    return count.map((item, index) => {
      return {
        name: names[index],
        value: item,
      };
    });
  }, [offlineSystems]);

  // const handleSetSiteId = async () => {
  //   const siteId = splitName(site.selectedSite as string);
  //   setSelectecSiteId(siteId[0]);
  // };

  useEffect(() => {
    // handleSetSiteId();

    getChartSiteSystemObjectCount(
      {},
      // selectedSiteId
      //   ? {
      //       siteId: selectedSiteId,
      //     }
      //   : {}
    );

    eventOfflinePast24Hours();
    eventOfflinePast7Days();
    eventOfflinePast30Days();

    getChartEventCountbyStatus({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      // site: selectedSiteId ? selectedSiteId : "",
    });

    getTop10WeeklyAlertsBySite();
    getWeeklyAlertsBySystem();
    getWeeklyAlertsByPriority();
    getAllWeeklyAlerts();
    getWeeklyAlertsByDevices();

    getChartEventsReponseTime({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      // site: selectedSiteId ? [selectedSiteId] : [],
      vendors: [],
      objIds: [],
      itemKeys: [],
      itemLevels: [],
      groupBy: 0,
    });
  }, [
    site,
    // selectedSiteId
  ]);

  return (
    <Row gutter={[24, 24]}>
      {/* Statistic Cards */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <StatisticCard
              title="Open Tickets"
              loading={ChartEventStatusLoader}
              icon={<OpenTickets />}
              value={openAlarmTickets?.count ? openAlarmTickets?.count : 0}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Closed Tickets"
              loading={ChartEventStatusLoader}
              icon={<ClosedTickets />}
              value={closedAlarmTickets?.count ? closedAlarmTickets?.count : 0}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Success Rate"
              loading={ChartEventStatusLoader}
              icon={<SuccessRate />}
              value={`${Math.ceil(
                (closedAlarmTickets?.count / openAlarmTickets?.count) * 100,
              )}%`}
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
              data={totalAssetsData || []}
              isLoading={SiteSystemCountLoader}
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
              data={eventResponseTimeData}
              dataKey={EventReponseTimeChartData?.process.map((item: any) => {
                return item?.id;
              })}
              height={250}
              width={400}
              isLoading={EventReponseTimeLoader}
            />
          </Col>
          <Col span={8}>
            <BaseAreaChart
              stroke="#40A9FF"
              colors={["#40A9FF"]}
              fill="#1563a3"
              title="Recification Time"
              dataKey={EventReponseTimeChartData?.response.map((item: any) => {
                return item?.id;
              })}
              height={250}
              width={400}
              data={eventRectificationTimeData}
              isLoading={EventReponseTimeLoader}
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
              data={OfflineSystemsData || []}
              isLoading={SiteSystemCountLoader}
              // legend={false}
              colors={dangerChartColors}
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
                offLine24Hours.map((item: any) => ({
                  value: item.count,
                  name: item.name,
                })) || []
              }
              isLoading={EventCountOfflineHistoryLoader}
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
                offline7Days.map((item: any) => ({
                  value: item.count,
                  name: item.name,
                })) || []
              }
              isLoading={EventCountOfflineHistoryLoader}
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
                offline30Days.map((item: any) => ({
                  value: item.count,
                  name: item.name,
                })) || []
              }
              isLoading={EventCountOfflineHistoryLoader}
              legend={true}
              colors={dangerChartColors}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <TopAlertsBySite
              title="All Weekly Alerts"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="all-weekly-alerts"
              color={weeklyAlertChartBarColor}
              data={allWeeklyAlerts}
              isLoading={ChartTop10EventsLoader}
            />
          </Col>
          <Col span={8}>
            <AlertsByPriority
              title="Weekly Alerts by Priority"
              // tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={weeklyAlertsbyPriority.length.toString()}
              data={
                weeklyPriorityData.map((item: any) => ({
                  value: item.count,
                  name: item.name,
                })) || []
              }
              isLoading={ChartTop10EventsLoader}
              colors={priorityChartColors}
            />
          </Col>
          <Col span={8}>
            <AlertsByMonth
              title="Alerts by Month"
              // tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-alerts-by-month"
              data={weeklyPriorityData}
              isLoading={ChartTop10EventsLoader}
              priority={true}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={12} className="overflow-scroll h-100">
            <AlertsByPriority
              title="Weekly Alerts by System"
              // tooltipText="TODO: Add tooltip text"
              className={`${styles.widget}  ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-alerts-by-system"
              centerText={weeklyAlertsBySystem?.length.toString()}
              data={
                weeklyAlertsBySystem?.map((item: any) => ({
                  value: item.count,
                  name: item.name,
                })) || []
              }
              isLoading={ChartTop10EventsLoader}
              colors={
                weeklyAlertsBySystem.length <= systemChartColors.length
                  ? systemChartColors
                  : systemChartColors
              }
            />
          </Col>
          <Col span={12}>
            <TopAlertsBySite
              title="Top 10 Weekly Alerts by Site"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="top-10-alerts-by-site-chart"
              color={siteChartBarColor}
              data={top10WeeklyAlertsBySite}
              isLoading={ChartTop10EventsLoader}
            />
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <AlertsByMonth
          title="Alerts by Devices"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-alerts-by-devices"
          data={weeklyAlertsbyDevices}
          isLoading={ChartTop10EventsLoader}
        />
      </Col>
    </Row>
  );
};
