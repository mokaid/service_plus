import { message, Spin, Table } from "antd";
import { useCallback, useEffect, useState, type FC } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { ProcessAlarmModal } from "@/modals/process-alarm-modal";

import {
  useDeleteMaskedItemMutation,
  useGetMaskedItemMutation,
  useGetSitesQuery,
} from "@/services";
import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";

type Props = {
  className: string;
  dataTestId: string;
};

export const MaskedSourceTable: FC<Props> = ({ className, dataTestId }) => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [getMaskedItems, { isLoading, data }] = useGetMaskedItemMutation();
  const { currentData: sites } = useGetSitesQuery({});

  const [messageApi, messageContext] = message.useMessage();
  const [deleteMaskedItem] = useDeleteMaskedItemMutation();

  useEffect(() => {
    getMaskedItems({ pageSize, pageIndex });
  }, [pageSize, pageIndex]);

  const handleProcessAlarm = useCallback(
    async (data: any) => {
      const response = await deleteMaskedItem(data);
      if ("data" in response && response.data.error == 0) {
        messageApi.success("Recovery Successful");
      } else if ("error" in response) {
        messageApi.error("There was an error");
      }
      await getMaskedItems({ pageSize, pageIndex });
    },
    [dispatch, pageSize, pageIndex],
  );

  const handlePageChange = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
  };

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
    sites: sites ? sites?.data : [],
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      {messageContext}
      <Table
        rowKey="siteId"
        className={className}
        scroll={{ x: 1200 }}
        dataSource={data ? data?.data?.list : []}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: isLoading,
        }}
        pagination={{
          pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          total: data?.data?.total || 0,
          current: pageIndex,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
      />

      <ProcessAlarmModal refetch={getMaskedItems} dataTestId="process-alarm" />
    </>
  );
};
