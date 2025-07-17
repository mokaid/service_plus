import { message, Spin, Table } from "antd";
import { useCallback, useEffect, useState, type FC } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { ProcessAlarmModal } from "@/modals/process-alarm-modal";

import {
  useDeleteMaskedItemMutation,
  useGetMaskedItemMutation,
  useGetSitesQuery,
  useGetUserAllowedSitesMutation,
} from "@/services";
import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";
import { useAppSelector } from "@/hooks/use-app-selector";
import { RootState } from "@/types/store";

type Props = {
  className: string;
  dataTestId: string;
};

export const MaskedSourceTable: FC<Props> = ({ className, dataTestId }) => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allowedMaskedSites, setAllowedMaskedSites] = useState<any[]>([]);

  const user = useAppSelector((state: RootState) => state?.authState?.user);

  //Masked Items
  const [getMaskedItems, { isLoading, data }] = useGetMaskedItemMutation();

  //USER ALLOWED SITES
  const [getUserAllowedSites] = useGetUserAllowedSitesMutation();

  const handleAllowedMaskedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });

    if ("data" in res) {
      const currentData = await getMaskedItems({ pageSize, pageIndex });
      const filteredSites: any[] = [];

      (currentData as any)?.data?.data?.list?.forEach((item: any) => {
        res?.data?.filter.forEach((sites: any) => {
          const splittedValue = sites.orgId.split("0")[0];
          let newSiteId;
          if (splittedValue.length === 2) {
            newSiteId = `0${sites?.orgId}`;
          } else {
            newSiteId = `00${sites?.orgId}`;
          }

          if (newSiteId) {
            if (newSiteId === item?.siteId) {
              filteredSites.push(item);
            } else {
              return;
            }
          }
        });
      });

      setAllowedMaskedSites(filteredSites);
    }
  };

  //Query Sites
  const { currentData: sites } = useGetSitesQuery({});

  const [messageApi, messageContext] = message.useMessage();
  const [deleteMaskedItem] = useDeleteMaskedItemMutation();

  const getMaskedItemsData = () => {
    if (user?.role === 99 && user?.permission) {
      handleAllowedMaskedSites();
    } else {
      (async () => {
        const res = await getMaskedItems({ pageSize, pageIndex });
        setAllowedMaskedSites((res as any)?.data?.data?.list);
      })();
    }
  };

  useEffect(() => {
    getMaskedItemsData();
  }, [pageSize, pageIndex]);

  const handleProcessAlarm = useCallback(
    async (data: any) => {
      const response = await deleteMaskedItem(data);
      if ("data" in response && response.data.error == 0) {
        messageApi.success("Recovery Successful");
        getMaskedItemsData();
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
        dataSource={allowedMaskedSites}
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
