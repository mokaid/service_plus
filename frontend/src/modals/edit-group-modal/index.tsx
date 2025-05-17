import { useAppSelector } from "@/hooks/use-app-selector";
import styles from "./index.module.css";
import { usePostGroupMutation } from "@/services";
import { ThemeContext } from "@/theme";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { Button, Drawer, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MessageInstance } from "antd/es/message/interface";
import { useContext, useEffect } from "react";
import { getGroupObject, getShowEditGroupDrawer } from "@/store/selectors/sites";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setShowEditGroupDrawer } from "@/store/slices/sites";

type Fields = {
  name: string;
};

const EditGroupModal = (
  { messageApi, refetch }:
  { messageApi: MessageInstance, refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>> }
) => {
    const [editGroup, {isLoading: orgLoading}] = usePostGroupMutation();
    const group = useAppSelector(getGroupObject);
    const show = useAppSelector(getShowEditGroupDrawer);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const handleSubmitGroup = async (data: any) => {
      try {
        const result = await editGroup({
          id: group.id,
          ...data
        });
          if ( 'data' in result && !result?.data?.error ) {
            messageApi.success(`Group has been edited successfully !`);
            refetch({});
            handleCancel();
          } else if ( 'data' in result && result?.data?.error ) {
            messageApi.error(result?.data?.desc);
          }
        } catch (error) {
          console.log(error);
          messageApi.error("There was an error");
        }
    }

    const handleCancel = () => {
      dispatch(setShowEditGroupDrawer(false));
      form.resetFields();
    }

    useEffect(() => {
      form.setFieldsValue({
        name: group.name,
      })
    }, [group])

    const { Item } = Form;
    const { appTheme } = useContext(ThemeContext);
    const darkTheme = appTheme === "dark";

    return (
    <Drawer
        open={show}
        width={460}
        title="Edit Group"
        onClose={handleCancel}
        style={{ background:`${ darkTheme ? "#0C183B": "" }`  }}
      >
        <Form<Fields>
        form={form}
        layout="vertical"
        name="alerts-search"
        disabled={orgLoading}
        onFinish={handleSubmitGroup}
        data-testid="alerts-search-form"
      >
        <Item<Fields>
          label="Group Name"
          name="name"
          rules={[{ required: true, message: "Write group name" }]}
        >
          <Input placeholder="Type here..." className={darkTheme ? styles.input_bg : ""} />
        </Item>
        <div className={styles.btn_container}>
        <Button
          type="primary"
          htmlType="submit"
          loading={orgLoading}
          style={{
            borderRadius: "1px",
            flex: 1,
          }}
        >
          Update Group
        </Button>
      </div>
      </Form>
      </Drawer>
    );
};
  
export default EditGroupModal;