import { type FC, useCallback, useState } from "react";
import { Spin, Table } from "antd";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
  setShowSiteInfoModal,
} from "@/store/slices/events";
import type { DeviceEvent } from "@/types/device-event";

import { generateColumns } from "./config";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getAlarmRecordEvents,
  getSelectedRowIds,
} from "@/store/selectors/events";
import { LoadingOutlined } from "@ant-design/icons";
import { SiteInfo } from "@/modals/site-info-modal";
import { OrganisationSite } from "@/types/organisation";
import { setSelectedSite, setSiteObject } from "@/store/slices/sites";

type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
  sites: OrganisationSite[]
};
export const SiteMapTable: FC<Props> = ({
  className,
  dataTestId,
  sites,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
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

  const handleSiteInfo = (data: OrganisationSite) => {
    dispatch(setShowSiteInfoModal(true));
    dispatch(setSelectedSite(data.id));
    dispatch(setSiteObject(data));
  };

  const columns = generateColumns({
    onClick: handleSiteInfo
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        rowKey="eventId"
        className={className}
        dataSource={sites}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || isLoading,
        }}
        pagination={false}
        // pagination={{
        //   pageSize,
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   // total: Math.ceil(totalAlerts / pageSize),
        //   total: totalAlerts,
        //   current: pageIndex,
        //   onChange: handlePageChange,
        // }}
        data-testid={dataTestId}
      />
    </>
  );
};
