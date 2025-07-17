import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
} from "antd";
import { type FC, useContext, useEffect, useState } from "react";

import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  useConfigureBoxMutation,
  useGetBoxPropertyMutation,
  usePostOrgContactsMutation,
} from "@/services";
import { getShowConfigureSiteDrawer } from "@/store/selectors/sites";
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
  site: any;
  setSiteInfoData: React.Dispatch<any>;
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

export const EditSiteModal: FC<Props> = ({
  refetch,
  dataTestId,
  site,
  setSiteInfoData,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const show = useAppSelector(getShowConfigureSiteDrawer);
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
        style={{ background: `${darkTheme ? " #0C183B" : ""}` }}
      >
        <EditSiteForm
          refetch={refetch}
          messageApi={messageApi}
          darkTheme={darkTheme}
          site={site}
          setSiteInfoData={setSiteInfoData}
        />
      </Drawer>
    </>
  );
};
const EditSiteForm = ({
  darkTheme,
  messageApi,
  refetch,
  site,
  setSiteInfoData,
}: {
  darkTheme: boolean;
  messageApi: MessageInstance;
  refetch: () => any;
  site: any;
  setSiteInfoData: React.Dispatch<any>;
}) => {
  const [siteData, setSiteData] = useState(site);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [postOrgContacts, { data: contactsData }] =
    usePostOrgContactsMutation();

  const [siteContactInfo, setSiteContactInfo] = useState([]);

  const [configureBox, { isLoading, data: editData }] =
    useConfigureBoxMutation();

  const [getBoxProperty, { data: siteInfo, isLoading: siteInfoLoader }] =
    useGetBoxPropertyMutation();

  useEffect(() => {
    setSiteData({
      ...site,
      activate: site?.activate
        ? `${formatDate(new Date(site?.activate))}`
        : undefined,
      deactivate: site?.deactivate
        ? `${formatDate(new Date(site?.deactivate))}`
        : undefined,
      simExpirationTime: site?.simExpirationTime
        ? `${formatDate(new Date(site?.simExpirationTime))}`
        : undefined,
    });
    const contacts = (site?.contacts || []).map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
      };
    });
    setSiteContactInfo(contacts);
  }, [site]);

  const handleSubmitSite = async (data: any) => {
    try {
      const result = await configureBox({
        ...data,
        contacts:
          siteContactInfo?.length > 0
            ? siteContactInfo?.map((item: any) => {
                return {
                  id: item.id,
                  name: item.name,
                  phone: item.phone,
                  email: item.email,
                };
              })
            : [],
        id: siteData.id,
        ...(data?.simExpirationTime
          ? {
              simExpirationTime: `${formatDate(
                new Date(data?.simExpirationTime),
              )}`,
            }
          : {}),
        ...(data?.activate
          ? { activate: `${formatDate(new Date(data?.activate))}` }
          : {}),
        ...(data?.deactivate
          ? { deactivate: `${formatDate(new Date(data?.deactivate))}` }
          : {}),
      });
      if ("data" in result && !result?.data?.error) {
        for (let i = 0; i < siteContactInfo.length; i++) {
          const object: any = siteContactInfo[i];

          await postOrgContacts({
            id: object.id,
            name: object.name,
            email: object.email,
            phone: object.phone,
          });
        }

        const boxProperty = await getBoxProperty({
          siteId: site?.id,
        }).unwrap();

        await messageApi.success(`Site has been updated successfully !`);
        setSiteData(boxProperty?.site);
        setSiteInfoData(boxProperty);
        setSiteContactInfo(
          boxProperty?.site?.contacts?.length > 0
            ? boxProperty?.site?.contacts?.map((item: any) => {
                return {
                  id: item.id,
                  name: item.name,
                  phone: item.phone,
                  email: item.email,
                };
              })
            : [],
        );
        dispatch(setShowConfigureSiteDrawer(false));
        dispatch(setShowSiteInfoModal(false));
      }
    } catch (error) {
      messageApi.error("There was an error");
    }
  };

  const handleOnChange = (id: string, value: string, key: string) => {
    setSiteContactInfo((prev: any) => {
      return prev.map((item: any) => {
        if (item.id === id) {
          return { ...item, [key]: value };
        } else {
          return item;
        }
      });
    });
  };

  useEffect(() => {
    form.setFieldsValue(siteData);
  }, [siteData]);

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
          rules={[{ required: true, message: "Write site name" }]}
        >
          <Input
            placeholder="Type here..."
            className={darkTheme ? styles.input_bg : ""}
          />
        </Item>
        <Item<SiteFields> label="Remark" name="remark">
          <Input
            placeholder="Type here..."
            className={darkTheme ? styles.input_bg : ""}
          />
        </Item>
        <Item<SiteFields> label="Address" name="address">
          <Input
            placeholder="Type here..."
            className={darkTheme ? styles.input_bg : ""}
          />
        </Item>
        <Row style={{ marginBottom: 20 }}>
          <Col span={12}>
            {(siteContactInfo || []).map((item: any, index: number) => (
              <Card title={`Contact${index + 1}`} className="contact_card">
                <Item<SiteFields> label="Name">
                  <Input
                    placeholder="Type here..."
                    className={darkTheme ? styles.input_bg : ""}
                    value={item.name}
                    onChange={(e) =>
                      handleOnChange(item.id, e.target.value, "name")
                    }
                  />
                </Item>
                <Item<SiteFields> label="Phone Number">
                  <Input
                    placeholder="Type here..."
                    className={darkTheme ? styles.input_bg : ""}
                    value={item.phone}
                    onChange={(e) => {
                      handleOnChange(item.id, e.target.value, "phone");
                    }}
                  />
                </Item>
                <Item<SiteFields> label="Email">
                  <Input
                    placeholder="Type here..."
                    className={darkTheme ? styles.input_bg : ""}
                    value={item.email}
                    onChange={(e) => {
                      handleOnChange(item.id, e.target.value, "email");
                    }}
                  />
                </Item>
              </Card>
            ))}
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Item<SiteFields> label="Longitude" name="longitude">
              <InputNumber
                placeholder="Type here..."
                className={darkTheme ? styles.input_bg : ""}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item<SiteFields> label="Latitude" name="latitude">
              <InputNumber
                placeholder="Type here..."
                className={darkTheme ? styles.input_bg : ""}
              />
            </Item>
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
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
        <Col span={12}>
          <Item<SiteFields>
            label="SIM Expiration Time"
            name="simExpirationTime"
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
        {/* <Item<SiteFields> label="SIM Expiration Time" name="simExpirationTime">
          <Input
            placeholder="Type here..."
            className={darkTheme ? styles.input_bg : ""}
          />
        </Item> */}
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
