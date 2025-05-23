import { Spin, Table, message } from "antd";
import { useCallback, useEffect, useState, type FC } from "react";

import { useAppSelector } from "@/hooks/use-app-selector";
import { ProcessAlarmModal } from "@/modals/process-alarm-modal";
import {
  useGetUserAllowedSitesMutation,
  useProcessEventMutation,
  useQueryEventsMutation,
} from "@/services";
import { getSelectedRowIds } from "@/store/selectors/events";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
  setTotalAlertsGlobal,
} from "@/store/slices/events";
import { DeviceEvent } from "@/types/device-event";
import { ReqProcessEvent } from "@/types/process-event";
import { RootState } from "@/types/store";
import { LoadingOutlined } from "@ant-design/icons";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { generateColumns } from "./config";
type Props = {
  className: string;
  dataTestId: string;
  data?: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: (page: number, pageSize: number) => void;
  loading: boolean;
  refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>;
};

export const AllAlertsTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  refetch,
}: Props) => {
  const dispatch = useDispatch();
  // const event = useAppSelector(getEvents); //needs to be passed from parents

  const rowKey = useAppSelector(getSelectedRowIds);
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [getEvents, { data: events, isLoading: tableLoading }] =
    useQueryEventsMutation();

  const [allowedSites, setAllowedSites] = useState<any[]>([]);

  const [messageApi, contextHolder] = message.useMessage();
  const filters = useSelector((state: RootState) => state.filters);
  const user = useSelector((state: RootState) => state.authState.user);

  //USER ALLOWED SITES
  const [getUserAllowedSites] = useGetUserAllowedSitesMutation();

  const handleAllowedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });
    if ("data" in res) {
      setAllowedSites(
        (res.data.filter || []).map((item: { orgId: string }) => {
          return item.orgId;
        }),
      );
    }
  };

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
    [dispatch, refetch],
  );

  const handleMark = async (selectedEvent: DeviceEvent) => {
    const event: Array<number> = [];
    event.push(...event, selectedEvent.eventId);
    const body: ReqProcessEvent = {
      event,
      processStatus: 2,
    };
    const res = await handleProcessEvents(body);

    if (res) {
      if ("data" in res) {
        getEvents({ ...filters, processed: 0 });

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

  useEffect(() => {
    handleAllowedSites();
  }, []);

  useEffect(() => {
    (async () => {
      await getEvents({
        ...filters,
        pageSize,
        pageIndex,
        sites: filters.sites.length > 0 ? filters.sites : [],
        processed: 0,
      });
    })();
  }, [filters, pageSize, pageIndex, getEvents, refetch]);

  useEffect(() => {
    if (events) {
      const total = events?.data?.totalCount || 0;
      dispatch(setTotalAlertsGlobal(total));
    }
  }, [dispatch, events]);

  return (
    <>
      {contextHolder}
      <Table
        rowKey="eventId"
        // headerBg="#fff"
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
          current: pageIndex,
          total: events?.data?.totalCount,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
        // preserveSelectedRowKeys={true}
      />

      <ProcessAlarmModal refetch={refetch} dataTestId="process-alarm" />
    </>
  );
};
