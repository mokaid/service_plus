import { ConfigProvider, Spin, Table, message } from "antd";
import { useCallback, useContext, useEffect, useState, type FC } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "@/hooks/use-app-selector";
import { ProcessAlarmMapModal } from "@/modals/alert-map-modal";
import { useProcessEventMutation, useQueryEventsMutation } from "@/services";
import { getAlertMapEvents, getSelectedRowIds } from "@/store/selectors/events";
import {
  setAlertMapEvents,
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import { DeviceEvent } from "@/types/device-event";
import { ReqProcessEvent } from "@/types/process-event";
import { generateColumns } from "./config";
import { RootState } from "@/types/store";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "@/theme";
type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: (page: number, size: number) => void;
  loading: boolean;
};

export const AllAlertsMapTable: FC<Props> = ({
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
  // const siteEvents = useAppSelector(getAlertMapEvents);
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const rowKey = useAppSelector(getSelectedRowIds);
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const filters = useSelector((state: RootState) => state.filters);
  const location = useLocation();

  const [getEvents, { data: events, isLoading: tableLoading }] =
    useQueryEventsMutation();

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId({ selectedRowKeys, pageIndex }));
  };

  const rowSelection = {
    selectedRowKeys: rowKey,
    onChange: onSelectChange,
  };

  const handleProcessAlarm = useCallback(
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
      dispatch(setShowProcesslarmModal(true));
    },
    [dispatch],
  );
  const handleMark = async (selectedEvent: DeviceEvent) => {
    setIsLoading(true);
    const event: Array<number> = [];
    event.push(...event, selectedEvent.eventId);
    const body: ReqProcessEvent = {
      event,
      processStatus: 2,
    };
    const res = await handleProcessEvents(body);
    if (res) {
      setIsLoading(false);
      if ("data" in res) {
        await getEvents({
          ...filters,
          processed: 0,
          sites: [location.search.split("=")[1]],
        });

        dispatch(setAlertMapEvents(events.data.event));

        messageApi.open({
          type: "success",
          content: "Process status updated",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Process status update failed",
        });
      }
    }
  };

  useEffect(() => {
    (async () => {
      await getEvents({
        ...filters,
        pageSize,
        pageIndex,
        sites:
          filters.sites.length > 0
            ? filters.sites
            : [location.search.split("=")[1]],
        processed: 0,
      });
    })();
  }, [filters, pageSize, pageIndex, getEvents]);

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
    onMark: handleMark,
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      {contextHolder}
      <ConfigProvider>
        <Table
          rowKey="eventId"
          className={className}
          scroll={{ x: 1200 }}
          dataSource={events?.data?.event}
          sticky={true}
          columns={columns}
          rowSelection={rowSelection}
          showSorterTooltip={false}
          loading={{
            indicator: <Spin indicator={antIcon} />,
            spinning: loading || tableLoading,
          }}
          pagination={{
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total: Math.ceil(totalAlerts / pageSize),
            current: pageIndex,
            onChange: handlePageChange,
          }}
          data-testid={dataTestId}
          // preserveSelectedRowKeys={true}
        />
      </ConfigProvider>

      <ProcessAlarmMapModal
        dataTestId="process-alarm"
        refetch={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};
