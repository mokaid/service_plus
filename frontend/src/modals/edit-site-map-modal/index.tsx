import { Button, DatePicker, Drawer, Form, Input, message, Space } from "antd";
import { useState, type FC, useContext, useEffect} from "react";

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { EditSiteInfo } from "@/components/edit-site-info";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getShowEventsFilterModalState } from "@/store/selectors/events";
import { setShowEventsFilterModal } from "@/store/slices/events";
import { getDateFromEvent } from "@/utils/form-helpers/get-date-from-event";
import { getDateProps } from "@/utils/form-helpers/get-date-props";
import styles from "./index.module.css";
import { ThemeContext } from "@/theme";
import { setSelectedSite, setShowEditSiteDrawer } from "@/store/slices/sites";
import { getSelectedSite, getShowEditSiteDrawer } from "@/store/selectors/sites";
import { useGetBoxStatusMutation, useGetIoEventsMutation, useGetMaskedItemMutation } from "@/services";

type Props = {
  dataTestId?: string;
  site: string;
  handlePageFilterDate: (
    startDate: string,
    endDate: string,
    levels: number[],
  ) => void;
  alarmRecord?: boolean;
  title?: string;

};

type Fields = {
  datetime: string[];
  object: unknown[];
  priority: number[];
  site: unknown[];
  type: unknown[];
  value: unknown[];
  vendor: unknown[];
  system: unknown[];
  device: unknown[];
  eventDetails: unknown[];
  status: unknown[];
};

const { Item } = Form;
const { RangePicker } = DatePicker;
const initialValues: Fields = {
  datetime: [],
  status: [],
  object: [],
  priority: [],
  site: [],
  type: [],
  value: [],
  vendor: [],
  system: [],
  device: [],
  eventDetails: [],
};

export const EditSiteMapModal: FC<Props> = ({
  dataTestId,
  title
}) => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(getShowEditSiteDrawer);
  const [form] = Form.useForm<Fields>();
  const [messageApi, messageContext] = message.useMessage();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const site = useAppSelector(getSelectedSite);

  const [getMaskedItem, { isLoading: maskedItemLoading, data: maskedItem, reset: resetMasked }] = useGetMaskedItemMutation();
  const [getBoxStatus, { isLoading: boxStatusLoading, data: boxStatus, reset: resetBoxStatus }] = useGetBoxStatusMutation();
  const [getIoEvents, { isLoading: getIoEventsLoading, data: ioEvents, reset: resetIoEvents }] = useGetIoEventsMutation();

  const [dataReady, setDataReady] = useState(false);

  const handleReset = () => {
    form.resetFields();
    dispatch(setSelectedSite(""));
    dispatch(setShowEditSiteDrawer(false));
    resetBoxStatus();
    resetMasked();
    resetIoEvents();
  };

  const handleClose = () => {
    dispatch(setSelectedSite(""));
    dispatch(setShowEditSiteDrawer(false));
    resetBoxStatus();
    resetMasked();
    resetIoEvents();
    setDataReady(false);
  };

  const handleSubmit = (values: Fields) => {
    dispatch(setShowEventsFilterModal(false));
  };

  useEffect(() => {
      if ( site ) {
        getMaskedItem({});
        getBoxStatus({siteId: site});
        getIoEvents({siteId: site});
      }
  }, [site]);

  useEffect(() => {
    if(!boxStatusLoading && !maskedItemLoading && !getIoEventsLoading) {
      if ( !boxStatus?.error && !maskedItem?.error && !ioEvents?.error ) {
        setDataReady(true);
      } else if (boxStatus?.error) {
        messageApi.error({
          type: "error",
          content: `Failed to fetch Box staus, error code: ${boxStatus?.error}`,
          duration: 3
        })
      }
    } else {
      setDataReady(false);
    }
  }, [site, boxStatus, ioEvents, maskedItem]);
 
  return (
    <>
    {messageContext}
    <Drawer
      open={show}
      width={460}
      title={title ? title : "Edit Site"}
      extra={
      !title && (
        <Space>
        <Button
          type="default"
          onClick={handleReset}
          style={{
            background: "transparent",
            borderRadius: "1px",
            borderColor: "#1B3687",
          }}
        >
          Cancel
        </Button>
        <Button
          // type="primary"
          onClick={form.submit}
          danger
          icon={<DeleteOutlined />}
          style={{ borderRadius: "1px", background:`${darkTheme ? "rgba(12, 24, 59, 1)" : ""}`}}
        >
          Delete
        </Button>
        <Button
          type="primary"
          onClick={form.submit}
          style={{ borderRadius: "1px" }}
        >
          Save
        </Button>
      </Space>
      )
      }
      // destroyOnClose={true}
      onClose={handleClose}
      data-testid={dataTestId}
      className={`${darkTheme ? "modal_bg_dark" : ""}`}
    >
      {
        dataReady && <EditSiteInfo
          site={site}
          boxStatus={boxStatus?.data}
          ioEvents={ioEvents?.ioCustomText}
          maskedItem={maskedItem?.data}
          title={title}
        />
      }
    </Drawer>
    </>
  );
};
