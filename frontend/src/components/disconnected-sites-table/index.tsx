import { Spin, Table } from "antd";
import { type FC, useCallback, useEffect, useState } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import {
  setSelectedEventsId,
  setShowSiteInfoModal,
} from "@/store/slices/events";

import { useAppSelector } from "@/hooks/use-app-selector";
import { SiteInfo } from "@/modals/site-info-modal";
import { useGetSitesQuery } from "@/services";
import { getSelectedRowIds } from "@/store/selectors/events";
import { setSiteObject, sites } from "@/store/slices/sites";
import { OrganisationSite } from "@/types/organisation";
import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";

type Props = {
  className: string;
  dataTestId: string;
  loading: boolean;
};

export const DisconnectedSitesTable: FC<Props> = ({
  className,
  dataTestId,
  loading,
}) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [disconnectedSites, setDisconnectedSites] = useState<any[]>([]);

  const [siteLoading, setSiteLoading] = useState<boolean>(false);

  const { currentData, isLoading, refetch } = useGetSitesQuery({
    connectionState: 0,
    pageIndex,
    pageSize,
  });

  useEffect(() => {
    const interval = setInterval(refetch, 10000);

    if (disconnectedSites.length !== (currentData || []).length) {
      // if (disconnectedSites.length < (currentData || []).length) {
      // }
      setDisconnectedSites(currentData);
      setTotalItems(currentData.length);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentData]);

  const dispatch = useAppDispatch();
  const rowKey = useAppSelector(getSelectedRowIds);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId(selectedRowKeys));
    console.log("Selected Row Keys:", rowKey);
  };

  const handleProcessAlarm = useCallback(
    (record: OrganisationSite) => {
      dispatch(setSiteObject(record));
      dispatch(setShowSiteInfoModal(true));
    },
    [dispatch],
  );

  const handlePageChange = async (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
    try {
      await refetch();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        rowKey="eventId"
        className={className}
        scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={
          disconnectedSites
            ? disconnectedSites.filter((site: any) => site.connectionState == false)
            : currentData.filter((site: any) => site.connectionState == false)
        }
        // headerBg={"#0000FF"}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || siteLoading,
        }}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: totalItems,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
      />

      <SiteInfo refetch={refetch} />
    </>
  );
};
