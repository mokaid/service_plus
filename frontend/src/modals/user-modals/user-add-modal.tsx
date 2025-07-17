import { useAppSelector } from "@/hooks/use-app-selector";
import {
  useGetOrganizationsMutation,
  usePostSingleUserPermissionMutation,
  usePostUserFilterMutation,
  usePostUserPermissionListMutation,
  useRegisterUserMutation,
} from "@/services";
import { ThemeContext } from "@/theme";
import { Organisation, OrganisationSite } from "@/types/organisation";
import { camelToSentence } from "@/utils/camelCase";
import {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Drawer,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Switch,
  message,
} from "antd";
import { Md5 } from "ts-md5";
import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import { permissionEncode } from "@/utils/form-helpers/permissionsFunction";

type Props = {
  Show: boolean;
  setAddUser: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<any, any, any, any, any>
  >;
};

type Permissions = Record<
  string,
  {
    v?: 1 | 0;
    c?: 1 | 0;
    m?: 1 | 0;
    d?: 1 | 0;
    e?: 1 | 0;
  }
>;

const permissions: Permissions = {
  Dashboard: { v: 0, m: 0 },
  alarmParent: { v: 0 },
  record: { v: 0, m: 0, e: 0 },
  pending: { v: 0, m: 0 },
  dispatched: { v: 0, m: 0 },
  quickly: { v: 0, m: 0 },
  map: { v: 0 },
  siteMapParent: { v: 0 },
  siteMap: { v: 0, c: 0, m: 0, d: 0 },
  Configuration: { v: 0 },
  siteConfiguration: { v: 0, c: 0, m: 0, d: 0 },
  siteUpgrade: { v: 0, c: 0, m: 0, d: 0 },
  audioConfiguration: { v: 0, c: 0, m: 0, d: 0 },
  maskedSourceParent: { v: 0 },
  maskSource: { v: 0, m: 0 },
  disconnectParent: { v: 0 },
  disconnect: { v: 0 },
  // userParent: { v: 0 },
  // user: { v: 0, c: 0, m: 0, d: 0 },
};

const keyToLabelMap = {
  v: "View",
  c: "Create",
  m: "Modify",
  d: "Delete",
  e: "Export",
};

const OrganizationsSelect = ({ form }: { form: FormInstance<any> }) => {
  const [getOrganizations, { isLoading, data: organizations, isSuccess }] =
    useGetOrganizationsMutation();
  const [organization, setOrganization] = useState<string>();
  const [sites, setSites] = useState<[]>([]);

  useEffect(() => {
    getOrganizations({});
  }, [getOrganizations]);

  useEffect(() => {
    form.resetFields(["sites"]);
    setSites([]);
    if (organization && organizations?.orgs) {
      const selectedOrg = organizations?.orgs.filter(
        (org: any) => org.id == organization,
      );

      if (selectedOrg.length > 0) {
        if (selectedOrg[0]?.sites && selectedOrg[0]?.sites.length > 0) {
          const sitesOptions = selectedOrg[0].sites.map(
            (site: OrganisationSite) => ({
              label: site.name,
              value: site.id,
            }),
          );
          setSites(sitesOptions);
        }
      }
    }
  }, [organization]);

  const options =
    isSuccess && organizations?.orgs
      ? organizations.orgs.map((org: Organisation) => ({
          label: org.name,
          value: org.id,
        }))
      : [];

  return (
    <>
      <Form.Item
        name={"organization"}
        label={"Organization"}
        rules={[{ required: true, message: "Choose an organization" }]}
        style={{ width: "100%" }}
      >
        <Select
          loading={isLoading}
          options={options}
          onChange={setOrganization}
        />
      </Form.Item>
      {sites && sites?.length > 0 && (
        <Form.Item name={"sites"} label={"Sites"} style={{ width: "100%" }}>
          <Select mode="multiple" loading={isLoading} options={sites} />
        </Form.Item>
      )}
    </>
  );
};

export const AddUserModal: FC<Props> = ({ Show, setAddUser, refetch }) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState(permissions);
  const [selectedRole, setSelectedRole] = useState("user");
  const [status, setStatus] = useState(true);

  const uid = useAppSelector(
    (state) => state.authState.user?.userGuid as string,
  );

  const [messageApi, contextHolder] = message.useMessage();

  const [registerUser, { isLoading: registerLodaer }] =
    useRegisterUserMutation();

  const handlePermissionChange = (
    key: string,
    selectedPermissions: string[],
  ) => {
    const availablePermissions = Object.keys(permissions[key]);
    const selected: Record<string, Record<string, number>> = {
      [key]: {},
    };

    availablePermissions.map((permission: string) => {
      selected[key][permission] = selectedPermissions.includes(permission)
        ? 1
        : 0;
    });

    setSelectedPermissions((prevPermissions) => ({
      ...prevPermissions,
      ...selected,
    }));
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedPermissions(permissions);
    setSelectedRole("");
    setStatus(true);
    setAddUser(false);
  };

  const [postUserFilter, { isLoading: postUserFilterLodader }] =
    usePostUserFilterMutation();

  const [postSingleUserPermission, { isLoading: SingleUserPermissionLoader }] =
    usePostSingleUserPermissionMutation();

  const handleSubmit = async (data: any) => {
    try {
      const userData = {
        userName: data.userName,
        parentGuid: uid,
        password: Md5.hashStr(data.password),
        nickName: data.nickName,
        remark: data.remark,
        loginType: 1,
        appEnable: ["sp"],
        role: data.role === "user" ? 33 : 99,
        permission: permissionEncode(selectedPermissions),
      };

      let filterSitesAndOrgsId = [];
      if (data?.role === "customer") {
        filterSitesAndOrgsId = data?.sites.map((siteId: string) => {
          return {
            // orgId: data.organization,
            // groupId: siteId,
            orgId: siteId,
          };
        });
      }

      const result = await registerUser(userData);

      if ("data" in result && !result?.data?.error) {
        await postSingleUserPermission({
          userGuid: result?.data?.userGuid,
          userName: data.userName,
          sysRole:
            data.role === "user" ? 33 : data?.role === "customer" ? 99 : 0,
          permission: permissionEncode(selectedPermissions),
        });

        if (data.role === "customer") {
          const res = await postUserFilter({
            userGuid: result?.data?.userGuid,
            filter: [{ orgId: data.organization }, ...filterSitesAndOrgsId],
          });
        } else {
          const res = await postUserFilter({
            userGuid: result?.data?.userGuid,
          });
        }

        messageApi.success(`User has been added successfully !`);

        // await updatePermissions(userUpdateData);
        refetch();
        handleCancel();
      } else {
        handleCancel();
        messageApi.error("There was an error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
      {contextHolder}
      <Drawer
        open={Show}
        width={800}
        title="Add New User"
        style={{ background: `${darkTheme ? " #0C183B" : ""}` }}
        onClose={() => setAddUser(false)}
      >
        <Form
          form={form}
          layout="vertical"
          name="add-user-form"
          disabled={registerLodaer}
          onFinish={handleSubmit}
        >
          {/* User Information Section */}
          <Card
            title="User Information"
            bordered={false}
            style={{ background: `${darkTheme ? "rgb(5, 15, 49)" : ""}` }}
            extra={
              <Form.Item
                name={"status"}
                initialValue={status}
                valuePropName="checked"
              >
                <Switch
                  checked={status}
                  onChange={setStatus}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  style={{ background: status ? "green" : "#f24747" }}
                />
              </Form.Item>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="userName"
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input className={styles.input_bg} placeholder="Enter name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nickname" name="nickName" initialValue={""}>
                  <Input
                    className={styles.input_bg}
                    placeholder="Enter Nickname"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  initialValue={selectedRole}
                  rules={[{ required: true, message: "Please select a role" }]}
                >
                  <Select
                    className="select_input"
                    placeholder="Select role"
                    onChange={setSelectedRole}
                  >
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter a password" },
                  ]}
                >
                  <Input.Password
                    className={styles.input_bg}
                    placeholder="Enter Password"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label="Remark" name="remark" initialValue={""}>
                  <Input
                    className={styles.input_bg}
                    placeholder="Write a remark (optional)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Customer Organization & Sites */}
          {selectedRole == "customer" && (
            <Card
              title="Organization & Sites"
              bordered={false}
              style={{
                marginTop: 24,
                background: `${darkTheme ? "rgb(5, 15, 49)" : ""}`,
              }}
            >
              <OrganizationsSelect form={form} />
            </Card>
          )}

          {/* Permissions Section */}
          {(selectedRole == "user" || selectedRole == "customer") && (
            <Card
              title="Permissions"
              bordered={false}
              style={{
                marginTop: 24,
                background: `${darkTheme ? "rgb(5, 15, 49)" : ""}`,
              }}
            >
              <Row gutter={[16, 16]}>
                {Object.entries(selectedPermissions).map(([key, perms]) => {
                  // Determine the available permissions based on the keys in the object
                  const availablePermissions = Object.keys(perms).map(
                    (permKey) => ({
                      label:
                        keyToLabelMap[permKey as keyof typeof keyToLabelMap],
                      value: permKey,
                    }),
                  );

                  return (
                    <Col span={12} key={key}>
                      <Card
                        size="small"
                        title={camelToSentence(key)}
                        bordered
                        style={{
                          background: `${darkTheme ? "rgb(5, 15, 49)" : ""}`,
                        }}
                      >
                        <Checkbox.Group
                          className={"filter_checkbox"}
                          options={availablePermissions}
                          onChange={(selectedPermission) => {
                            handlePermissionChange(
                              key,
                              selectedPermission as string[],
                            );
                          }}
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 24,
            }}
          >
            <Button
              className={styles.default_btn}
              type="default"
              onClick={() => {
                setAddUser(false);
                handleCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              loading={registerLodaer || postUserFilterLodader}
            >
              Create
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
