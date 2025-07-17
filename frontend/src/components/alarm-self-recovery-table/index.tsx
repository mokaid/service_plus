import styles from "./index.module.css";
import { Button, Col, DatePicker, Spin, Table, message } from "antd";
import { useEffect, useCallback, useState, type FC, useContext } from "react";

import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import { DeviceEvent } from "@/types/device-event";
import { generateColumns } from "./config";
import {
  formatDate,
  getLastMonthDate,
  getLastWeekDate,
} from "@/utils/general-helpers";
import {
  useGetFastRecoveryMutation,
  useGetUserAllowedSitesMutation,
  useQueryeventsiteMutation,
} from "@/services";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { ThemeContext } from "@/theme";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getRecoveryFiltersState } from "@/store/selectors/recovery";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setRecoveryFilters } from "@/store/slices/recovery";
import { RootState } from "@/types/store";
type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
};

const { RangePicker } = DatePicker;

export const AlarmSelfRecoveryTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
}: Props) => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [alertsSite, setAlertsSite] = useState<any[]>([]);

  const user = useAppSelector((state: RootState) => state.authState.user);

  const { startTime, endTime } = useAppSelector(getRecoveryFiltersState);

  const [getFastRecovery, { data: currentData, isLoading: recoveryLoading }] =
    useGetFastRecoveryMutation();

  const [getUserAllowedSites, { isLoading: allowedSitesLoadaer }] =
    useGetUserAllowedSitesMutation();

  const handleAllowedSitesForWeeklyALertsOfCustomer = async (data: any[]) => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });

    if ("data" in res) {
      const filteredSites: any[] = [];
      ((data || currentData) as any)?.data?.site?.forEach((item: any) => {
        res?.data?.filter.forEach((sites: any) => {
          const splittedValue = sites.orgId.split("0")[0];
          let newSiteId;
          if (splittedValue.length === 2) {
            newSiteId = `0${sites?.orgId}`;
          } else {
            newSiteId = `00${sites?.orgId}`;
          }

          if (newSiteId) {
            if (newSiteId === item?.id) {
              filteredSites.push(item);
            } else {
              return;
            }
          }
        });
      });

      setAlertsSite(filteredSites);
    }
  };

  const date = new Date();

  const [selectedDates, setSelectedDates] = useState<
    [dayjs.Dayjs, dayjs.Dayjs]
  >(() => {
    const today = dayjs();
    const lastMonthDate = dayjs().subtract(1, "month");
    return [lastMonthDate, today];
  });
  const [body, setBody] = useState({
    startTime: startTime,
    endTime: endTime,
  });

  const handleDateChange = (dates: any) => {
    if (dates) {
      setSelectedDates(dates); // Update the state with the selected dates
      dispatch(
        setRecoveryFilters({
          startTime: dates ? formatDate(dates[0].toDate()) : startTime,
          endTime: dates ? formatDate(dates[1].toDate()) : endTime,
        }),
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res: any = await getFastRecovery(body);

      if (user?.role === 99 && user?.permission) {
        handleAllowedSitesForWeeklyALertsOfCustomer(res?.data);
      } else {
        setAlertsSite(res?.data?.data?.site);
      }
    })();
  }, [user, body]);

  console.log(alertsSite);

  useEffect(() => {
    if (selectedDates) {
      setBody({
        startTime: startTime, // Convert Dayjs to Date
        endTime: endTime, // Convert Dayjs to Date
      });
    }
  }, [startTime, endTime]);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId({ selectedRowKeys, pageIndex }));
  };

  const rowSelection = {
    // selectedRowKeys: rowKey,
    onChange: onSelectChange,
  };

  const handleProcessAlarm = useCallback(
    (selectedEvent: any) => {
      console.log(selectedEvent, "selectedEvent");

      // dispatch(setSelectedEvents([selectedEvent]));
      // dispatch(setShowProcesslarmModal(true));
      navigate(
        `/alarm/self-recovery-site?siteId=${selectedEvent.id}&&title=${selectedEvent.name}`,
      );
    },
    [dispatch],
  );

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
      {contextHolder}
      <Col span={24}>
        <div
          className={styles.container}
          style={{ marginBottom: 20 }}
          data-testid="alarm-record-grid-search"
        >
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format={APP_DATE_TIME_FORMAT}
            className={`date_input_alarm ${
              darkTheme ? "date_input_alarm_bg" : ""
            }`}
            style={{ flex: 1 }}
            value={selectedDates} // Set default values
            onChange={handleDateChange}
          />
        </div>
      </Col>
      <Table
        rowKey="id"
        className={className}
        scroll={{ x: 1200 }}
        sticky={true}
        columns={columns}
        dataSource={alertsSite}
        // rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={recoveryLoading}
        // pagination={{
        //   pageSize,
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   total: Math.ceil(totalAlerts / pageSize),
        //   current: pageIndex,
        //   onChange: handlePageChange,
        // }}
        data-testid={dataTestId}
        // preserveSelectedRowKeys={true}
      />
    </>
  );
};
