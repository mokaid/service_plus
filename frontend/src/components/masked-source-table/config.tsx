import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { DeviceEvent } from "@/types/device-event";
import { OrganisationSite } from "@/types/organisation";
import { PermissionGuard } from "../permission-guard";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (data: any) => void;
  sites: OrganisationSite[];
};

export const generateColumns = ({
  onProcess,
  sites,
}: ColumnParams): ColumnType<DeviceEvent>[] => {
  return [
    {
      title: "Site",
      dataIndex: "siteName",
    },
    {
      title: "Contact 1",
      dataIndex: "contact1",
      // render: (_, record) => {
      //   const site = sites ? sites.filter(s => s.id == record?.siteId) : {};
      //   return  <>{site?.contactPerson}</>
      // }
    },
    {
      title: "Contact 2",
      dataIndex: "contact1",
      // render: (_, record) => {
      //   const site = sites ? sites.filter(s => s.id == record?.siteId) : {};
      //   return  <>{site?.contactPerson2}</>
      // }
    },
    {
      title: "Key",
      sorter: true,
      dataIndex: "key",
      render: (text) => (
        <span style={{ color: `rgba(92, 219, 29, 1)` }}>{text}</span>
      ),
    },

    {
      title: "Device",
      sorter: true,
      dataIndex: "objName",
    },

    {
      title: "Actions",
      dataIndex: "eventId",
      sorter: false,
      width: 130,
      fixed: "right",
      render(_, record) {
        return (
          <PermissionGuard keyName="maskSource" action="m">
            <Link onClick={() => onProcess({
              keyId: record?.systemId,
              type: record?.type
            })}>
              Recovery
            </Link>
          </PermissionGuard>
        );
      },
    },
  ];
};
