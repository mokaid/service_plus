import { Divider, Spin, Table, Typography, message } from "antd";
import { useCallback, useEffect, useState, type FC } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/use-app-selector";
import { ProcessAlarmMapModal } from "@/modals/alert-map-modal";
import {
  useGetUserAllowedSitesMutation,
  useProcessEventMutation,
  useQueryEventsMutation,
} from "@/services";
import { getAlertMapEvents, getSelectedRowIds } from "@/store/selectors/events";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import { DeviceEvent } from "@/types/device-event";
import { ReqProcessEvent } from "@/types/process-event";
import { generateColumns } from "./config";
import { useLocation } from "react-router-dom";
import { getRecoveryFiltersState } from "@/store/selectors/recovery";
type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: (pageIndex: number, pageSize: number) => void;
  loading: boolean;
};
export const AlarmSelfRecoverySiteTable: FC<Props> = ({
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
  const event = useAppSelector(getAlertMapEvents);
  const rowKey = useAppSelector(getSelectedRowIds);
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const siteId = queryParams.get("siteId");
  const { startTime, endTime } = useAppSelector(getRecoveryFiltersState);
  const [allowedSites, setAllowedSites] = useState();

  const [getEvents, { data: events, isLoading: tableLoading }] =
    useQueryEventsMutation();

  //USER ALLOWED SITES
  const [getUserAllowedSites] =
    useGetUserAllowedSitesMutation();
  const handleAllowedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: undefined });
    if ('data' in res) {
      setAllowedSites(
        res.data.filter.map((item: { orgId: string }) => {
          return item.orgId;
        }),
      );
    }
  };
  useEffect(() => {
    handleAllowedSites();
    (async () => {
      await getEvents({
        // ...filters,
        startTime,
        endTime,
        sites: allowedSites ? allowedSites : [siteId],
        pageSize,
        pageIndex,
        ...{
          processed: 99,
        },
      });
    })();
  }, [pageSize, pageIndex, allowedSites]);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId({ selectedRowKeys, pageIndex }));
  };

  const refetch = async () => {
    await getEvents({
      // ...filters,
      sites: [siteId],
      pageSize,
      pageIndex,
      ...{
        processed: 99,
      },
    });
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
      if ('data' in res) {
        refetch();
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

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
    onMark: handleMark,
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      {contextHolder}
      <Typography.Title level={4}>
        Total Alerts {events?.data?.totalCount || 0}
      </Typography.Title>
      <Divider />
      <Table
        rowKey="eventId"
        className={className}
        scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={events?.data?.event}
        sticky={true}
        columns={columns}
        rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={tableLoading}
        pagination={{
          pageSize,
          current: pageIndex,
          total: events?.data?.totalCount,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
        // preserveSelectedRowKeys={true}
      />

      <ProcessAlarmMapModal refetch={refetch} dataTestId="process-alarm" />
    </>
  );
};
