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
  eventsData?: any[];
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: (page: number, pageSize: number) => void;
  loading: boolean;
  refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>;
  eventsLodaer: boolean;
  setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
  recordTable?: boolean;
};

export const AllAlertsTable: FC<Props> = ({
  className,
  dataTestId,
  eventsData,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  refetch,
  eventsLodaer,
  setRefetch,
  recordTable,
}: Props) => {
  const dispatch = useDispatch();
  // const event = useAppSelector(getEvents); //needs to be passed from parents

  const rowKey = useAppSelector(getSelectedRowIds);
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [getEvents] = useQueryEventsMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const filters = useSelector((state: RootState) => state.filters);
  const user = useSelector((state: RootState) => state.authState.user);

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
    const event: Array<number> = [];
    event.push(...event, selectedEvent.eventId);
    const body: ReqProcessEvent = {
      event,
      processStatus: 2,
    };

    const res = await handleProcessEvents(body);

    if (res) {
      if ("data" in res) {
        refetch({
          ...filters,
          processed: recordTable ? -1 : 0,
        });

        setRefetch?.(true);

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
    recordTable: recordTable,
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    (async () => {
      await refetch({
        ...filters,
        pageSize,
        pageIndex,
        processed: recordTable ? -1 : 0,
      });
    })();
  }, [filters, pageSize, pageIndex, recordTable]);

  useEffect(() => {
    if (eventsData) {
      const total = (eventsData as any)?.data?.totalCount || 0;
      dispatch(setTotalAlertsGlobal(total));
    }
  }, [eventsData]);

  return (
    <>
      {contextHolder}
      <Table
        rowKey="eventId"
        // headerBg="#fff"
        className={className}
        scroll={{ x: 1200 }}
        dataSource={(eventsData as any)?.data?.event}
        sticky={true}
        columns={columns}
        rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || eventsLodaer,
        }}
        pagination={{
          pageSize,
          current: pageIndex,
          total: (eventsData as any)?.data?.totalCount,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
        // preserveSelectedRowKeys={true}
      />

      <ProcessAlarmModal
        refetch={refetch}
        dataTestId="process-alarm"
        setRefetch={setRefetch}
        recordTable={recordTable}
      />
    </>
  );
};
