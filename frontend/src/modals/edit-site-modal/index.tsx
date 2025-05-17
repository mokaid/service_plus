import { Button, Card, Col, DatePicker, Drawer, Form, Input, InputNumber, message, Row } from "antd";
import { type FC, useContext, useEffect } from "react";

import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { useConfigureBoxMutation } from "@/services";
import { getShowConfigureSiteDrawer, getSiteObject } from "@/store/selectors/sites";
import { setShowSiteInfoModal } from "@/store/slices/events";
import { setShowConfigureSiteDrawer } from "@/store/slices/sites";
import { ThemeContext } from "@/theme";
import { getDateFromEvent } from "@/utils/form-helpers/get-date-from-event";
import { getDateProps } from "@/utils/form-helpers/get-date-props";
import { formatDate } from "@/utils/general-helpers";
import { MessageInstance } from "antd/es/message/interface";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  alarmRecord?: boolean;
  Show: boolean;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  organizations: any;
  organizationsLoading: boolean;
  refetch: () => any;
};

type SiteFields = {
  name: string;
  remark: string;
  address: string;
  contactPerson: string;
  contactPhoneNum: string;
  contactEmail: string;
  contactPerson2: string;
  contactPhoneNum2: string;
  contactEmail2: string;
  longitude: number;
  latitude: number;
  simExpirationTime: string;
  activate: string;
  deactivate: string;
};


const { Item } = Form;
const { TextArea } = Input;

export const EditSiteModal: FC<Props> = ({ refetch, dataTestId,}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const show = useAppSelector(getShowConfigureSiteDrawer)
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setShowConfigureSiteDrawer(false));
  };

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
    {contextHolder}
    <Drawer
      open={show}
      width={700}
      title="Configure Site (S+ box)"
      onClose={handleClose}
      data-testid={dataTestId}
      style={{ background:`${darkTheme ? " #0C183B" :"" }`  }}
    >
      <EditSiteForm
        refetch={refetch}
        messageApi={messageApi}
        darkTheme={darkTheme}
      />
    </Drawer>
    </>
  );
};
const EditSiteForm = ({
  darkTheme,
  messageApi,
  refetch,
}: {
  darkTheme:boolean,
  messageApi: MessageInstance,
  refetch: () => any;
}) => {
  const [configureBox, {isLoading}] = useConfigureBoxMutation();
  const [form] = Form.useForm();
  const siteObject = useAppSelector(getSiteObject);
  const dispatch = useAppDispatch();

  const handleSubmitSite = async (data: any) => {
    try {
    const result = await configureBox({
      ...data,
      id: siteObject.id,
      simExpirationTime: formatDate(new Date(data?.simExpirationTime)),
      activate: formatDate(new Date(data?.activate)),
      deactivate: formatDate(new Date(data?.deactivate))
    });
      if ( 'data' in result && !result?.data?.error ) {
        messageApi.success(`Site has been updated successfully !`);
        dispatch(setShowConfigureSiteDrawer(false));
        dispatch(setShowSiteInfoModal(false));
        refetch();
      } else if ( 'error' in result && result?.error ) {
        messageApi.error(result?.error);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("There was an error");
    }
  }

  useEffect(() => {
    form.setFieldsValue(siteObject);
  }, [siteObject])
  
  return (
    <>
    <Form<SiteFields>
      form={form}
      layout="vertical"
      name="edit-site-form"
      onFinish={handleSubmitSite}
      data-testid="add-site-form"
      disabled={isLoading}
    >
      {" "}
      <Item<SiteFields>
        label="Site Name"
        name="name"
        rules={[{ required: true, message: 'Write site name' }]}
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>
      <Item<SiteFields>
        label="Remark"
        name="remark"
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>
      <Item<SiteFields>
        label="Address"
        name="address"
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>

      <Row style={{marginBottom: 20}}>
        <Col span={12}>
          <Card title="Contact 1" className="contact_card">
            <Item<SiteFields>
              label="Name"
              name="contactPerson"
            >
              <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
            </Item>
            <Item<SiteFields>
              label="Phone Number"
              name="contactPhoneNum"
            >
              <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
            </Item>
            <Item<SiteFields>
              label="Email"
              name="contactEmail"
            >
              <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
            </Item>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Contact 2" className="contact_card">
              <Item<SiteFields>
                label="Name"
                name="contactPerson2"
              >
                <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
              </Item>
              <Item<SiteFields>
                label="Phone Number"
                name="contactPhoneNum2"
              >
                <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
              </Item>
              <Item<SiteFields>
                label="Email"
                name="contactEmail2"
              >
                <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
              </Item>
            </Card>
          </Col>
      </Row>

      <Row style={{marginBottom: 20}}>
        <Col span={12}>
          <Item<SiteFields>
            label="Longitude"
            name="longitude"
          >
            <InputNumber placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
          </Item>
        </Col>
        <Col span={12}>
          <Item<SiteFields>
            label="Latitude"
            name="latitude"
          >
            <InputNumber placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
          </Item>
        </Col>
      </Row>

      <Row style={{marginBottom: 20}}>
        <Col span={12}>
          <Item<SiteFields>
              label="Activate"
              name="activate"
              getValueFromEvent={getDateFromEvent}
              getValueProps={getDateProps}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format={APP_DATE_TIME_FORMAT}
                className="date_input"
              />
          </Item>
        </Col>
        <Col span={12}>
          <Item<SiteFields>
            label="Deactivate"
            name="deactivate"
            getValueFromEvent={getDateFromEvent}
            getValueProps={getDateProps}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format={APP_DATE_TIME_FORMAT}
              className="date_input"
            />
          </Item>
        </Col>
      </Row>

      <Item<SiteFields>
        label="SIM Expiration Time"
        name="simExpirationTime"
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>

      <div className={styles.btn_container}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          style={{
            borderRadius: "1px",
            flex: 1,
          }}
        >
          Update
        </Button>
      </div>
    </Form>
    </>
  );
};
