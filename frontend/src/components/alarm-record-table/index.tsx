import { type FC, useCallback, useState } from "react";
import { Spin, Table } from "antd";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { ProcessAlarmModal } from "@/modals/process-alarm-modal";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import type { DeviceEvent } from "@/types/device-event";

import { generateColumns } from "./config";
import { data as mockData } from "./mock";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getAlarmRecordEvents,
  getEvents,
  getSelectedRowIds,
} from "@/store/selectors/events";
import { LoadingOutlined } from "@ant-design/icons";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";

type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: (page: number, pageSize: number) => void;
  loading: boolean;
  refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>
};

export const AlarmRecordTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  refetch
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const event = useAppSelector(getAlarmRecordEvents);
  const rowKey = useAppSelector(getSelectedRowIds);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId(selectedRowKeys));
    console.log("Selected Row Keys:", rowKey);
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

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        rowKey="eventId"
        // headerBg="#fff"
        className={className}
        scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={mockData}
        // headerBg={"#0000FF"}
        sticky={true}
        columns={columns}
        rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || isLoading,
        }}
        pagination={{
          pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          // total: Math.ceil(totalAlerts / pageSize),
          total: totalAlerts,
          current: pageIndex,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
      />

      <ProcessAlarmModal refetch={refetch} dataTestId="process-alarm" />
    </>
  );
};
