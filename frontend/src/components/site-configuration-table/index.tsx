import { Spin, Table } from "antd";
import { useCallback, type FC } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setShowEventsFilterModal } from "@/store/slices/events";

import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";
import { TransformOrgs } from "@/utils/orgs-transform";

import { Organisation } from "@/types/organisation";

type Props = {
  className: string;
  dataTestId: string;
  data: { error: number; orgs: Organisation[]; total?: number } | undefined;
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
  totalAlerts: number;
  handlePageChange: (page: number, size: number) => void;
  loading: boolean;
  refetch: any;
};

type DeleteParams = {
  id: string;
  name: string;
  type: "organization" | "site";
};

type TableRecord = {
  id: string;
  name: string;
  isSite: boolean;
  isGroup: boolean;
  isOrganisation: boolean;
};

export const SiteConfigurationTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  isLoading,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  refetch,
}) => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(({ id, name, type }: DeleteParams) => {
    // Handle delete logic here
    console.log(`Deleting ${type} with id ${id} and name ${name}`);
  }, []);

  const handleEdit = useCallback(
    (record: TableRecord) => {
      dispatch(setShowEventsFilterModal(true));
    },
    [dispatch],
  );

  const columns = generateColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    refetch: refetch,
    record: {
      id: "",
      name: "",
      isSite: false,
      isGroup: false,
      isOrganisation: false,
      status: undefined,
      children: undefined,
    },
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        bordered
        rowKey="key"
        className={className}
        dataSource={data && data?.error == 0 ? TransformOrgs(data?.orgs) : []}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: totalAlerts,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, size) => handlePageChange(page, size),
        }}
        data-testid={dataTestId}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || isLoading,
        }}
      />
    </>
  );
};
