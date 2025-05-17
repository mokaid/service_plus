import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { type FC, useState } from "react";

import { BaseSelect } from "@/components/base-select";
import { useCreateSiteMutation, usePostOrganizationMutation } from "@/services";
import { Organisation } from "@/types/organisation";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MessageInstance } from "antd/es/message/interface";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  alarmRecord?: boolean;
  Show: boolean;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme?: boolean;
  organizations: any;
  organizationsLoading: boolean;
  getOrganizations: MutationTrigger<any>;
};

type SiteFields = {
  orgId: string;
  name: string;
  boxType: "Standard" | "Lite";
};

type OrgFields = {
  name: string;
  remark: string;
};

const { Item } = Form;
const { TextArea } = Input;

export const AddSiteModal: FC<Props> = ({
  getOrganizations,
  dataTestId,
  Show,
  setAddSite,
  darkTheme,
  organizations,
  organizationsLoading,
}) => {
  const show = Show;
  const [messageApi, contextHolder] = message.useMessage();
  const [index, setIndex] = useState<number>(0);

  const handleClose = () => {
    setAddSite(false);
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={show}
        width={460}
        title="Add New Site (S+ box)"
        onClose={handleClose}
        data-testid={dataTestId}
        style={{ background: `${darkTheme ? "#0C183B" : ""}` }}
      >
        {index === 0 && (
          <Step1
            getOrganizations={getOrganizations}
            organizationsLoading={organizationsLoading}
            organizations={organizations}
            setStep={setIndex}
            messageApi={messageApi}
            setAddSite={setAddSite}
            darkTheme={darkTheme || false}
          />
        )}
        {index === 1 && (
          <Step2
            getOrganizations={getOrganizations}
            setStep={setIndex}
            messageApi={messageApi}
            setAddSite={setAddSite}
            darkTheme={darkTheme || false}
          />
        )}
      </Drawer>
    </>
  );
};
const Step1 = ({
  setStep,
  setAddSite,
  darkTheme,
  messageApi,
  organizations,
  getOrganizations,
  organizationsLoading,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme: boolean;
  messageApi: MessageInstance;
  organizations: any;
  getOrganizations: MutationTrigger<any>;
  organizationsLoading: boolean;
}) => {
  const [createSite, { isLoading: siteCreationLoading }] =
    useCreateSiteMutation();
  const [form] = Form.useForm();

  const organizationsOptions = organizations?.orgs
    ? organizations.orgs.map((org: Organisation) => ({
        label: org.name,
        value: org.id,
      }))
    : [];

  const handleSubmitSite = async (data: any) => {
    try {
      const result = await createSite(data);
      if ('data' in result && !result?.data?.error) {
        messageApi.success(`Site has been added successfully !`);
        form.resetFields();
        getOrganizations({});
        // handleCancel();
        setAddSite(false);
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
      <Form<SiteFields>
        // form={form}
        layout="vertical"
        name="add-site-form"
        onFinish={handleSubmitSite}
        data-testid="add-site-form"
        disabled={siteCreationLoading}
      >
        {" "}
        <Item<SiteFields>
          label="Organization"
          name="orgId"
          rules={[{ required: true, message: "Select Organization" }]}
        >
          <BaseSelect
            placeholder="Select"
            allowClear={true}
            loading={organizationsLoading}
            options={organizationsOptions}
            className="select_input"
          />
        </Item>
        <Button
          type="default"
          className={styles.default_btn}
          style={{
            width: "100%",
          }}
          icon={<PlusOutlined />}
          onClick={() => setStep(1)}
        >
          Add New Organization
        </Button>
        <Divider />
        <Item<SiteFields>
          label="Site Name"
          name="name"
          rules={[{ required: true, message: "Write site name" }]}
        >
          <Input
            placeholder="Type here..."
            className={darkTheme ? styles.input_bg : ""}
            style={{ borderRadius: 50, backgroundColor: "red" }}
          />
        </Item>
        <Item<SiteFields>
          label="Box Type"
          name="boxType"
          rules={[{ required: true, message: "Select box type" }]}
        >
          <BaseSelect
            placeholder="Select"
            className="select_input"
            options={[
              {
                value: 0,
                label: "Standard",
              },
              {
                value: 1,
                label: "Lite",
              },
            ]}
          />
        </Item>
        <div className={styles.btn_container}>
          <Button
            type="default"
            style={{
              flex: 1,
            }}
            className={styles.default_btn}
            onClick={() => setAddSite(false)}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={siteCreationLoading}
            style={{
              borderRadius: "1px",
              flex: 1,
            }}
          >
            Create
          </Button>
        </div>
      </Form>
    </>
  );
};

const Step2 = ({
  setStep,
  setAddSite,
  darkTheme,
  messageApi,
  getOrganizations,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme: boolean;
  messageApi: MessageInstance;
  getOrganizations: MutationTrigger<any>;
}) => {
  const [createOrganization, { isLoading: orgCreationLoading }] =
    usePostOrganizationMutation();
  const handleSubmitOrganization = async (data: any) => {
    try {
      const result = await createOrganization(data);
      if ('data' in result && !result?.data?.error) {
        messageApi.success(`Organization has been added successfully !`);
        getOrganizations({});
        // handleCancel();
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
      <Space size={5} align="center" style={{ marginBottom: "1rem" }}>
        <ArrowLeftOutlined
          className={styles.title}
          onClick={() => setStep(0)}
        />
        <Typography.Title className={styles.title}>
          Add New Organization
        </Typography.Title>
      </Space>

      <Form<OrgFields>
        // form={form}
        layout="vertical"
        name="alerts-search"
        onFinish={handleSubmitOrganization}
        disabled={orgCreationLoading}
        data-testid="alerts-search-form"
      >
        {" "}
        <Item<OrgFields>
          label="Organization name"
          name="name"
          rules={[{ required: true, message: "Write organization name" }]}
        >
          <Input
            placeholder="Type here..."
            className={darkTheme ? styles.input_bg : ""}
          />
        </Item>
        <Item<OrgFields> label="Remark" name="remark">
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            maxLength={256}
            showCount={true}
            placeholder="Process notes"
            className={darkTheme ? styles.testingTextarea : ""}
          />
        </Item>
        <div className={styles.btn_container}>
          <Button
            type="default"
            style={{
              flex: 1,
            }}
            className={styles.default_btn}
            onClick={() => setAddSite(false)}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              borderRadius: "1px",
              flex: 1,
            }}
            loading={orgCreationLoading}
          >
            Create Organization
          </Button>
        </div>
      </Form>
    </>
  );
};
