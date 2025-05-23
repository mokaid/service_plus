import { useGetSitesQuery, useUpgradeBoxMutation } from "@/services";
import { ThemeContext } from "@/theme";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Skeleton,
  Table,
  TableColumnsType,
  Tag,
  TimePicker,
  TimePickerProps,
  Transfer,
  TransferProps,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import styles from "./index.module.css";

interface DataType {
  id: string;
  name: string;
}

interface PackageType {
  fileName: string;
  version: string;
  boxType: number;
}

interface Props {
  packages: PackageType[];
  className: string;
}

type TableTransferProps = TransferProps<DataType> & {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
  disabled: boolean;
};

export const SiteUpgradeTable = ({ packages, className }: Props) => {
  const { currentData, isLoading } = useGetSitesQuery({});
  const [targetKeys, setTargetKeys] = useState<
    TransferProps<DataType>["targetKeys"]
  >([]);
  const [upgradeBox, { isLoading: isUpgrading }] = useUpgradeBoxMutation();
  const [version, setVersion] = useState<string>("");
  const [boxType, setBoxType] = useState<number>(-1);
  const [time, setTime] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const onChange: TableTransferProps["onChange"] = (nextTargetKeys) => {
    console.log(nextTargetKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onChoosePackage = (value: string) => {
    const selectedPackage = packages.filter(
      (item: { fileName: string }) => item.fileName == value,
    )[0];
    setTargetKeys([]);
    setVersion(selectedPackage?.version);
    setBoxType(selectedPackage?.boxType);
  };

  const onChangeTime: TimePickerProps["onChange"] = (time, timeString) => {
    setTime(timeString);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      dataIndex: "name",
      title: "Name",
    },
    {
      title: "Box Type",
      dataIndex: "boxType",
      render: (value) => (
        <Tag color={value == 1 ? "orange" : "cyan"}>
          {" "}
          {value == 1 ? "Lite Version" : "Standard Version"}{" "}
        </Tag>
      ),
    },
  ];

  const filterOption = (input: string, item: DataType) =>
    item.id?.includes(input) || item.name?.includes(input);
  const onsubmit = async (fromData: { package: string }) => {
    if (targetKeys && targetKeys.length > 0) {
      const data = {
        siteId: targetKeys,
        fwVersion: version,
        fwPackageBlobPath: fromData?.package,
        fwPackageCompressFormat: "zip",
        executeTime: time,
      };
      const res = await upgradeBox(data);
      if (res) {
        if ("data" in res) {
          messageApi.open({
            type: "success",
            content: "Upgraded Successfully !",
          });
          form.resetFields();
          setTargetKeys([]);
        } else {
          messageApi.open({
            type: "error",
            content: "There was an error.",
          });
        }
      }
    } else {
      messageApi.open({
        type: "error",
        content: "Please select sites to upgrade",
      });
    }
  };

  return (
    <Skeleton loading={isLoading}>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Card
            title="Choose a package"
            style={{
              marginBottom: 20,
              background: `${darkTheme ? " #0C183B" : ""}`,
            }}
          >
            <Form
              layout="inline"
              onFinish={onsubmit}
              disabled={isUpgrading}
              form={form}
            >
              <Form.Item
                label="Package Name"
                name={"package"}
                rules={[{ required: true, message: "Please choose a package" }]}
              >
                <Select
                  className="select_input"
                  style={{
                    width: 300,
                    background: `${darkTheme ? " #0C183B" : ""}`,
                  }}
                  onChange={onChoosePackage}
                  options={
                    packages
                      ? packages.map(
                          (item: { fileName: string; boxType: number }) => ({
                            label: `${item.fileName} (${
                              item.boxType == 1
                                ? "Lite Version"
                                : "Standard Version"
                            })`,
                            value: item.fileName,
                          }),
                        )
                      : []
                  }
                />
              </Form.Item>
              <Form.Item label="Package Version">
                <Input className={styles.input_bg} readOnly value={version} />
              </Form.Item>
              <Form.Item
                label="Upgrade Time"
                name={"time"}
                rules={[{ required: true, message: "Please choose time" }]}
              >
                <TimePicker
                  className={styles.input_bg}
                  onChange={onChangeTime}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={isUpgrading}>
                Upgrade
              </Button>
            </Form>
          </Card>
        </Col>
        <Col span={24}>
          <TableTransfer
            className={styles.transferStyles}
            rowKey={(record) => record.id}
            dataSource={
              boxType > -1
                ? currentData.filter(
                    (item: DataType & { boxType: number }) =>
                      item.boxType == boxType,
                  )
                : []
            }
            titles={[
              boxType == -1 && (
                <Tag color="warning">Choose Package To See Sites</Tag>
              ),
            ]}
            targetKeys={targetKeys}
            showSearch
            showSelectAll={false}
            disabled={isUpgrading}
            onChange={onChange}
            filterOption={(input: string, item: DataType) =>
              filterOption(input, item)
            }
            leftColumns={columns}
            rightColumns={columns}
          />
        </Col>
      </Row>
    </Skeleton>
  );
};

const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, disabled, rightColumns, ...restProps } = props;
  return (
    <Transfer<DataType>
      disabled={disabled}
      style={{
        width: "100%",
      }}
      className={styles.transferStyles}
      {...restProps}
    >
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<DataType> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys.map(String), "replace");
          },
          selectedRowKeys: listSelectedKeys,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        };
        return (
          <Table<DataType>
            className={styles.site_upgrade_table}
            // className={darkTheme ? "alerts_table" : "alerts_table_light"}
            rowSelection={
              rowSelection as unknown as TableRowSelection<DataType>
            }
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{
              pointerEvents: listDisabled ? "none" : undefined,
            }}
            onRow={(record: DataType) => ({
              onClick: () => {
                if (listDisabled) {
                  return;
                }
                onItemSelect(record.id, !listSelectedKeys.includes(record.id));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};
