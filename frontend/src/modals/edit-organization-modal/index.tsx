import { useAppSelector } from "@/hooks/use-app-selector";
import styles from "./index.module.css";
import { usePostOrganizationMutation } from "@/services";
import { ThemeContext } from "@/theme";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { Button, Drawer, Form, Input, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MessageInstance } from "antd/es/message/interface";
import { useContext, useEffect } from "react";
import { getOrgObject, getSelectedOrg, getShowEditOrgDrawer } from "@/store/selectors/sites";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setShowEditOrgDrawer } from "@/store/slices/sites";

type OrgFields = {
    name: string;
    remark: string;
};

const EditOrganizationModal = ({ messageApi, refetch }: { messageApi: MessageInstance, refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>> }) => {
    const [editOrganization, {isLoading: orgLoading}] = usePostOrganizationMutation();
    const organization = useAppSelector(getOrgObject);
    const show = useAppSelector(getShowEditOrgDrawer);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const handleSubmitOrganization = async (data: any) => {
      try {
        const result = await editOrganization({
          id: organization.id,
          ...data
        });
          if ('data' in result && !result.data.error) {
            messageApi.success(`Organization has been edited successfully !`);
            refetch({});
            handleCancel();
          } else if ('error' in result) {
            messageApi.error(result.error.data?.desc || "There was an error");
          }
        } catch (error) {
          console.log(error);
          messageApi.error("There was an error");
        }
    }

    const handleCancel = () => {
      dispatch(setShowEditOrgDrawer(false));
      form.resetFields();
    }

    useEffect(() => {
      form.setFieldsValue({
        name: organization.name,
        remark: organization.remark
      })
    }, [organization])

    const { Item } = Form;
    const { appTheme } = useContext(ThemeContext);
    const darkTheme = appTheme === "dark";

    return (
    <Drawer
        open={show}
        width={460}
        title="Edit Organization"
        onClose={handleCancel}
        style={{ background:`${ darkTheme ? "#0C183B": "" }`  }}
      >
        <Form<OrgFields>
          form={form}
          layout="vertical"
          name="alerts-search"
          onFinish={handleSubmitOrganization}
          disabled={orgLoading}
        >
          {" "}
          <Item<OrgFields>
            label="Organization name"
            name="name"
            rules={[{ required: true, message: 'Write organization name' }]}
          >
            <Input placeholder="Type here..." className={darkTheme ? styles.input_bg : ""} />
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
              type="primary"
              htmlType="submit"
              style={{
                borderRadius: "1px",
                flex: 1,
              }}
              loading={orgLoading}
            >
              Update Organization
            </Button>
          </div>
        </Form>
      </Drawer>
    );
};
  
export default EditOrganizationModal;