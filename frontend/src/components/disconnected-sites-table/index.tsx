import { Spin, Table } from "antd";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import {
  setSelectedEventsId,
  setShowSiteInfoModal,
} from "@/store/slices/events";

import { useAppSelector } from "@/hooks/use-app-selector";
import { SiteInfo } from "@/modals/site-info-modal";
import {
  useGetBoxPropertyMutation,
  useGetSitesQuery,
  useGetUserAllowedSitesMutation,
} from "@/services";
import { getSelectedRowIds } from "@/store/selectors/events";
import { OrganisationSite } from "@/types/organisation";
import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";
import { RootState } from "@/types/store";

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
  const user = useAppSelector((state: RootState) => state.authState.user);

  const [siteLoading, setSiteLoading] = useState<boolean>(false);

  const { currentData, isLoading, refetch } = useGetSitesQuery({
    connectionState: 0,
    pageIndex,
    pageSize,
  });

  const [getUserAllowedSites] = useGetUserAllowedSitesMutation();

  const handleAllowedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });

    if ("data" in res) {
      const filteredSites: any[] = [];
      currentData?.forEach((item: any) => {
        res?.data?.filter?.forEach((sites: any) => {
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

      setDisconnectedSites(filteredSites);
      setTotalItems(filteredSites?.length);
    }
  };

  //Disconnected Sites
  const [getBoxProperty, { data: siteInfo }] = useGetBoxPropertyMutation();

  useEffect(() => {
    // Refetch Data
    const interval = setInterval(refetch, 10000);
    if (user?.role === 99 && user?.permission) {
      handleAllowedSites();
    } else {
      setDisconnectedSites(currentData);
      setTotalItems(currentData?.length);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentData, refetch, user, currentData]);

  const dispatch = useAppDispatch();
  const rowKey = useAppSelector(getSelectedRowIds);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId(selectedRowKeys));
    console.log("Selected Row Keys:", rowKey);
  };

  const handleProcessAlarm = useCallback(
    (record: OrganisationSite) => {
      getBoxProperty({
        siteId: record?.id,
      });
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

  const data = useMemo(() => {
    let array = [];
    if (disconnectedSites) {
      array = disconnectedSites.filter(
        (site: any) => site.connectionState == 0,
      );
    }
    setTotalItems(array?.length);
    return array;
  }, [disconnectedSites, currentData, user]);

  return (
    <>
      <Table
        rowKey="id"
        className={className}
        scroll={{ x: 1200 }}
        dataSource={data}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: isLoading || siteLoading,
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

      <SiteInfo refetch={refetch} sitesData={siteInfo} selectedSiteId="" />
    </>
  );
};
