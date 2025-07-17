import { Button, Divider, Space, Tag, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import {
  setGroupObject,
  setOrgObject,
  setSelectedSite,
  setShowEditGroupDrawer,
  setShowEditOrgDrawer,
  setShowEditSiteDrawer,
} from "@/store/slices/sites";
import type { OrganisationSite } from "@/types/organisation";
import {
  FolderFilled,
  HomeFilled,
  PoweroffOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import { PermissionGuard } from "../permission-guard";
import DeleteSiteButton from "./components/DeleteSiteButton";
import { GroupOrSiteNode } from "@/utils/orgs-transform";
const { Link } = Typography;

type TableRecord = {
  status: any;
  children: any;
  id: string;
  name: string;
  isSite: boolean;
  isGroup: boolean;
  isOrganisation: boolean;
};

type ColumnParams = {
  onDelete: ({
    id,
    name,
    type,
  }: {
    id: string;
    name: string;
    type: "organization" | "site";
  }) => void;
  onEdit: (record: TableRecord) => void;
  record: TableRecord;
  refetch: () => void;
};

const SitesActions: React.FC<ColumnParams> = ({
  onEdit,
  onDelete,
  refetch,
  record,
}) => {
  const dispatch = useAppDispatch();

  const editSite = (record: TableRecord) => {
    dispatch(setShowEditSiteDrawer(true));
    dispatch(setSelectedSite(record.id));
  };

  const editOrg = (record: TableRecord) => {
    dispatch(setShowEditOrgDrawer(true));
    dispatch(setOrgObject(record));
  };

  const editGroup = (record: TableRecord) => {
    dispatch(setShowEditGroupDrawer(true));
    dispatch(setGroupObject(record));
  };

  if (
    // record?.isSite
    record?.id?.split("").length > 3
  ) {
    return (
      <Space size={2} split={<Divider type="vertical" />}>
        <Button size="small" onClick={() => editSite(record)}>
          Edit Site
        </Button>
        <DeleteSiteButton refetch={refetch} id={record.id} />
      </Space>
    );
  } else if (
    // record?.isGroup
    record?.id?.split("").length === 2
  ) {
    return (
      <Space>
        <PermissionGuard keyName="siteConfiguration" action="m">
          <Button size="small" onClick={() => editGroup(record)}>
            Edit Group
          </Button>
        </PermissionGuard>
        {/* {!record?.children && (
          <PermissionGuard keyName="siteConfiguration" action="d">
            <Link
              onClick={() =>
                onDelete({
                  id: record.id,
                  name: record.name,
                  type: "organization",
                })
              }
            >
              Delete
            </Link>
          </PermissionGuard>
        )} */}
      </Space>
    );
  } else if (record?.isOrganisation) {
    return (
      <Space size={2} split={<Divider type="vertical" />}>
        <PermissionGuard keyName="siteConfiguration" action="m">
          <Link onClick={() => editOrg(record)}>Edit Organizatiom</Link>
        </PermissionGuard>
        {!record?.children && (
          <PermissionGuard keyName="siteConfiguration" action="d">
            <Link
              onClick={() =>
                onDelete({
                  id: record.id,
                  name: record.name,
                  type: "organization",
                })
              }
            >
              Delete
              {/* <DeleteOutlined /> */}
            </Link>
          </PermissionGuard>
        )}
      </Space>
    );
  }
};

const Icon: React.FC<{ record: TableRecord }> = ({ record }) => {
  if (
    // record?.isSite
    record?.id?.split("").length > 3
  ) {
    return (
      <VideoCameraFilled
        style={{ color: record?.status ? "#49aa19" : "#dc4446" }}
      />
    );
  } else if (
    // record?.isGroup
    record?.id?.split("").length === 2
  ) {
    return <FolderFilled />;
  } else if (record?.isOrganisation) {
    return <HomeFilled />;
  }
};

export const generateColumns = ({
  onDelete,
  onEdit,
  refetch,
}: ColumnParams): ColumnType<GroupOrSiteNode>[] => [
  {
    title: "Name",
    dataIndex: "name",
    width: 300,
    render: (value, record) => (
      <Space>
        <Icon record={record as any} /> {value}
      </Space>
    ),
  },
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value, record) =>
      record?.isSite && (
        <Tag color={value ? "green-inverse" : "error"}>
          {" "}
          <PoweroffOutlined /> {value ? "Online" : "Offline"}{" "}
        </Tag>
      ),
  },
  {
    title: "Box Type",
    dataIndex: "boxType",
    render: (value, record) =>
      record?.isSite && (
        <Tag color={value == 1 ? "orange" : "cyan"}>
          {" "}
          {value == 1 ? "Lite Version" : "Standard Version"}{" "}
        </Tag>
      ),
  },
  {
    title: "Actions",
    dataIndex: "",
    fixed: "right",
    render: (_, record) => (
      <SitesActions
        refetch={refetch}
        record={record as any}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
