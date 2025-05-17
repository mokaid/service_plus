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
import React, { FC, useContext, useEffect, useState } from "react";

import { useAppSelector } from "@/hooks/use-app-selector";
import {
  useGetOrganizationsMutation,
  useGetUserAllowedSitesMutation,
  useGetUserPermissionListQuery,
  usePostSingleUserPermissionMutation,
  usePostUserFilterMutation,
  useRegisterUserMutation,
} from "@/services";
import { ThemeContext } from "@/theme";
import { Organisation, OrganisationSite } from "@/types/organisation";
import { User } from "@/types/user";
import { camelToSentence } from "@/utils/camelCase";
import { decodeBase64 } from "@/utils/decodeBase64";
import { permissionEncode } from "@/utils/form-helpers/permissionsFunction";
import {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { CheckboxGroupProps } from "antd/es/checkbox";
import styles from "./index.module.css";

type Props = {
  Show: boolean;
  setEditUser: React.Dispatch<React.SetStateAction<User | false>>;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<any, any, any, any, any>
  >;
  user: User | null;
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

const OrganizationsSelect = ({
  form,
  user,
}: {
  user: User | null;
  form: FormInstance<any>;
}) => {
  const [getOrganizations, { isLoading, data: organizations, isSuccess }] =
    useGetOrganizationsMutation();
  const [organization, setOrganization] = useState<string>("");
  const [sites, setSites] = useState<[]>([]);
  const [allowedSites, setAllowedSites] = useState([]);

  //USER ALLOWED SITES
  const [getUserAllowedSites, { isLoading: allowedSitesLoadaer }] =
    useGetUserAllowedSitesMutation();

  const handleAllowedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });
    if ("data" in res && res.data) {
      setAllowedSites(
        res.data.filter.map((item: any) => {
          return item.orgId;
        }),
      );
    }
  };

  useEffect(() => {
    handleAllowedSites();
    getOrganizations({});
  }, [getOrganizations, user]);

  useEffect(() => {
    if (organization && organizations?.orgs) {
      const selectedOrg = organizations?.orgs.find(
        (org: any) => org.id == organization,
      );
      if (selectedOrg?.sites?.length > 0) {
        const sitesOptions = selectedOrg.sites.map(
          (site: OrganisationSite) => ({
            label: site.name,
            value: site.id,
          }),
        );
        setSites(sitesOptions);

        // Ensure selected sites are synced with form
        // form.setFieldsValue({
        //   sites: form.getFieldValue("sites") || [],
        // });
      } else {
        setSites([]);
        // form.setFieldsValue({ sites: [] });
      }
    }
  }, [user, organization, organizations, form]);

  useEffect(() => {
    handleAllowedSites();
    getOrganizations({});
  }, [getOrganizations]);

  useEffect(() => {
    if (user && organizations?.orgs) {
      const allOrganizations = organizations.orgs.map((org: Organisation) => ({
        label: org.name,
        value: org.id,
      }));
      let selectedOrgId = "";
      allOrganizations.forEach((item: any) => {
        const org = allowedSites.find((site) => site === item.value);
        if (org) {
          selectedOrgId = org;
        }
      });

      let splitOrgId: string;
      if (selectedOrgId.split("0").length > 2) {
        splitOrgId = selectedOrgId.split("0")[2];
      } else {
        splitOrgId = selectedOrgId.split("0")[1];
      }

      setOrganization(selectedOrgId);
      form.setFieldsValue({
        organization: selectedOrgId,
        sites:
          allowedSites
            ?.filter((item) => item !== selectedOrgId)
            .map((item: string) => {
              const siteId = item.split(`${splitOrgId}00`)[1];
              if (siteId?.length > 2) {
                return `${selectedOrgId}00${siteId}`;
              } else {
                return `0${selectedOrgId}00${siteId}`;
              }
            }) || [],
      });
    }
  }, [user, form, allowedSites, organizations]);

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
        name="organization"
        label="Organization"
        rules={[{ required: true, message: "Choose an organization" }]}
        style={{ width: "100%" }}
      >
        <Select
          loading={isLoading}
          options={options}
          className="select_input"
          onChange={(value) => {
            setOrganization(value);
            form.setFieldsValue({ organization: value, sites: [] }); // Reset sites when organization changes
          }}
        />
      </Form.Item>
      {sites?.length > 0 && (
        <Form.Item name="sites" label="Sites" style={{ width: "100%" }}>
          <Select
            className="select_input"
            mode="multiple"
            loading={isLoading}
            options={sites}
          />
        </Form.Item>
      )}
    </>
  );
};

export const EditUserModal: FC<Props> = ({
  Show,
  setEditUser,
  refetch,
  user,
}) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState(permissions);
  const [selectedRole, setSelectedRole] = useState("user");
  const [status, setStatus] = useState(true);
  //   const uid = useAppSelector((state) => state.authState.user?.userGuid as string);

  const [messageApi, contextHolder] = message.useMessage();

  const uid = useAppSelector(
    (state) => state.authState.user?.userGuid as string,
  );

  const [registerUser, { isLoading: registerLodaer }] =
    useRegisterUserMutation();

  const {
    isLoading: Permissionsloader,
    refetch: refetchUsersPermissions,
    data: getAllUsersPermsiions,
  } = useGetUserPermissionListQuery({});

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
    setEditUser(false);
  };

  const [postSingleUserPermission, { isLoading: SingleUserPermissionLoader }] =
    usePostSingleUserPermissionMutation();

  const [postUserFilter, { isLoading: postUserFilterLodader }] =
    usePostUserFilterMutation();

  const handleSubmit = async (data: any) => {
    try {
      const userData = {
        nickName: data.nickName,
        remark: data.remark,
        loginType: 1,
        appEnable: ["sp"],
        userGuid: user?.userGuid,
        role: data.role === "user" ? 33 : 99,
      };

      let filterSitesAndOrgsId = [];
      if (data?.role === "customer") {
        filterSitesAndOrgsId = data?.sites.map((siteId: string) => {
          return {
            orgId: siteId,
          };
        });
      }

      const result = await registerUser(userData);

      if ('data' in result && !result?.data?.error) {
        await postSingleUserPermission({
          userGuid: user?.userGuid,
          userName: data.userName,
          role: data.role === "user" ? 33 : 99,
          permission: permissionEncode(selectedPermissions),
        });

        if (data.role === "customer") {
          const res = await postUserFilter({
            userGuid: user?.userGuid,
            filter: [{ orgId: data.organization }, ...filterSitesAndOrgsId],
          });
        }

        messageApi.success(`User has been updated successfully !`);

        refetch();
        refetchUsersPermissions();
        handleCancel();
      } else {
        messageApi.error("There was an error");
      }
    } catch (error) {
      console.log(error);
      messageApi.error("There was an error");
    }
  };

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role === 99 ? "customer" : "user");
      const userPermissions = user.permission
        ? decodeBase64(user.permission)
        : "";
      const filteredPermissions = { ...userPermissions };

      delete filteredPermissions["user"];
      delete filteredPermissions["userParent"];

      setSelectedPermissions(
        userPermissions ? filteredPermissions : permissions,
      );
      setStatus(user.status ? true : false);
      form.setFieldsValue({
        ...user,
        role: user.role === 99 ? "customer" : "user",
        status: user.status ? true : false,
      });
    }
  }, [user]);

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
      {contextHolder}
      <Drawer
        open={Show}
        width={800}
        title="Edit User"
        onClose={() => setEditUser(false)}
        style={{ background: `${darkTheme ? " #0C183B" : ""}` }}
      >
        <Form
          form={form}
          layout="vertical"
          name="add-user-form"
          disabled={registerLodaer}
          onFinish={handleSubmit}
          initialValues={user ? user : {}}
        >
          {/* User Information Section */}
          <Card
            title="User Information"
            bordered={false}
            style={{
              marginTop: 24,
              background: `${darkTheme ? "rgb(5, 15, 49)" : ""}`,
            }}
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
                  // rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input
                    disabled
                    className={styles.input_bg}
                    placeholder="Enter name"
                  />
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
                <Form.Item label="Password" name="password">
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
              <OrganizationsSelect user={user} form={form} />
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
                  const availablePermissions: CheckboxGroupProps["options"] =
                    Object.keys(perms).map((permKey) => ({
                      label:
                        keyToLabelMap[permKey as keyof typeof keyToLabelMap],
                      value: permKey,
                    }));
                  const checkedValues = Object.keys(perms).filter(
                    (permKey) => perms[permKey as keyof typeof perms],
                  );

                  return (
                    <Col span={12} key={key}>
                      <Card
                        style={{
                          background: `${darkTheme ? "rgb(5, 15, 49)" : ""}`,
                        }}
                        size="small"
                        title={camelToSentence(key)}
                        bordered
                      >
                        <Checkbox.Group
                          value={checkedValues}
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
              type="default"
              className={styles.default_btn}
              onClick={() => {
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
              Update
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
