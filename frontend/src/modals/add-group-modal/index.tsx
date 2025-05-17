import { Button, Drawer, Form, Input, message } from "antd";
import { useEffect, useState, type FC } from "react";

import { BaseSelect } from "@/components/base-select";
import { usePostGroupMutation } from "@/services";
import { Organisation, OrganisationGroup } from "@/types/organisation";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  alarmRecord?: boolean;
  Show: boolean;
  setAddGroup: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme?: boolean;
  organizations: any;
  organizationsLoading: boolean;
  getOrganizations: MutationTrigger<any>;
};

type Fields = {
  organization: string[];
  name: string;
  orgId: string[];
  parentGroupId?: string;
};

const { Item } = Form;

// const initialValues: Fields = {
//   organization: [],
//   sitename: "",
//   boxtype: [],
//   organizationname: "",
// };

export const AddGroupModal: FC<Props> = ({
  organizationsLoading,
  getOrganizations,
  organizations,
  dataTestId,
  Show,
  setAddGroup,
  darkTheme,
}) => {
  const show = Show;
  const [form] = Form.useForm<Fields>();
  const [messageApi, contextHolder] = message.useMessage();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>();

  const organizationsOptions = organizations?.orgs
    ? organizations.orgs.map((org: Organisation) => ({
        label: org.name,
        value: org.id,
      }))
    : [];

  useEffect(() => {
    if (organizations?.error == 0) {
      if (organizations.orgs.length > 0) {
        const org = organizations.orgs.filter((org: Organisation) => org.id == selectedOrg);
        const groupsArray = [];
        if (org && org[0].groups) {
          const groups = org[0].groups.map((group: OrganisationGroup) => ({
            label: group.name,
            value: group.id,
          }));
          groupsArray.push(...groups);
          setGroups(groupsArray);
        } else {
          setGroups([]);
        }
      }
    }
  }, [selectedOrg]);

  const [createGroup, { isLoading }] = usePostGroupMutation();

  const handleClose = () => {
    setAddGroup(false);
  };

  const handleSubmit = async (data: any) => {
    try {
      const result = await createGroup(data);
      if ('data' in result && !result?.data?.error) {
        setAddGroup(!Show);
        messageApi.success(`Group has been added successfully !`);
        getOrganizations({});
        form.resetFields();
      } else if ('data' in result && result?.data?.error) {
        messageApi.error(result?.data?.desc);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("There was an error");
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={show}
        width={460}
        title="Add New Group"
        onClose={handleClose}
        data-testid={dataTestId}
        style={{ background: `${darkTheme ? "#0C183B" : ""}` }}
      >
        <Form<Fields>
          form={form}
          layout="vertical"
          name="alerts-search"
          disabled={isLoading}
          // initialValues={initialValues}
          onFinish={handleSubmit}
          data-testid="alerts-search-form"
        >
          <Item<Fields>
            label="Organization"
            name="orgId"
            rules={[{ required: true, message: "Select organization" }]}
          >
            <BaseSelect
              placeholder="Select"
              allowClear={true}
              loading={organizationsLoading}
              options={organizationsOptions}
              onChange={(value: string) => setSelectedOrg(value)}
              className="select_input"
            />
          </Item>
          <Item<Fields>
            label="Group Name"
            name="name"
            rules={[{ required: true, message: "Write group name" }]}
          >
            <Input
              placeholder="Type here..."
              className={darkTheme ? styles.input_bg : ""}
            />
          </Item>

          <Item<Fields> label="Parent Group" name="parentGroupId">
            <BaseSelect
              placeholder="Select"
              allowClear={true}
              options={groups}
              className="select_input"
            />
          </Item>
          <div className={styles.btn_container}>
            <Button
              type="default"
              style={{
                flex: 1,
              }}
              className={styles.default_btn}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{
                borderRadius: "1px",
                flex: 1,
              }}
            >
              Create
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
