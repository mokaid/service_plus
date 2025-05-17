import { UploadPackageModal } from "@/modals/upload-package-modal";
import { formatFileSize } from "@/utils/fileSize";
import { getFormattedDateTime } from "@/utils/get-formatted-date-time";
import { PlusOutlined } from "@ant-design/icons";
import {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { Button, Col, Row, Space, Table, Tag } from "antd";
import { useContext, useState } from "react";
import DeletePackgeButton from "./DeletePackageButton";
import { ThemeContext } from "@/theme";
import { PermissionGuard } from "@/components/permission-guard";

interface Props {
  loading: boolean;
  data: any[];
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<any, any, any, any, any>
  >;
}

export const PackagesTable = ({ data, loading, refetch }: Props) => {
  const [openUpload, setOpenUpload] = useState(false);
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
      <Row>
        <Col span={24}>
          <Space style={{ marginBottom: 20 }}>
            <PermissionGuard keyName="siteUpgrade" action="c">
              <Button
                size="large"
                className="primary_button"
                type="primary"
                icon={<PlusOutlined color="white" />}
                onClick={() => setOpenUpload(true)}
              >
                Upload New Package
              </Button>
            </PermissionGuard>
          </Space>
        </Col>
        <Col span={24}>
          <Table
            dataSource={data}
            loading={loading}
            className={darkTheme ? "alerts_table" : "alerts_table_light"}
          >
            <Table.Column title="Package Name" dataIndex={"fileName"} />
            <Table.Column
              title="Box Type"
              dataIndex="boxType"
              render={(value) => (
                <Tag color={value == 1 ? "orange" : "cyan"}>
                  {" "}
                  {value == 1 ? "Lite Version" : "Standard Version"}{" "}
                </Tag>
              )}
            />
            <Table.Column
              title="Package Type"
              dataIndex="packageType"
              render={(value) => (
                <Tag color={value == 1 ? "blue" : "volcano"}>
                  {" "}
                  {value == 1 ? "OS" : "Firmware"}{" "}
                </Tag>
              )}
            />
            <Table.Column title="Version" dataIndex="version" />
            <Table.Column
              title="Package Size"
              dataIndex="size"
              render={(value) => <Tag>{formatFileSize(value)}</Tag>}
            />
            <Table.Column
              title="Upload Time (UTC)"
              dataIndex="creation_time_UTC"
              render={(value) =>
                getFormattedDateTime(new Date(value).toDateString())
              }
            />
            <Table.Column
              title="Options"
              render={(_, record: any) => (
                <Space>
                  <PermissionGuard keyName="siteUpgrade" action="d">
                    <DeletePackgeButton id={record.id} refetch={refetch} />
                  </PermissionGuard>
                </Space>
              )}
            />
          </Table>
        </Col>
      </Row>
      <PermissionGuard keyName="siteUpgrade" action="c">
        <UploadPackageModal
          refetch={refetch}
          setShow={setOpenUpload}
          show={openUpload}
        />
      </PermissionGuard>
    </>
  );
};
