import { Button, Drawer, Form, Input, Radio, Space, Spin, message } from "antd";
import { useState, type FC } from "react";
import { useDidUpdate } from "rooks";

import { AlarmInfoList } from "@/alarm-info-list";
import { SiteInfoList } from "@/components/site-info-list";
import { DescriptionList } from "@/description-list";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getSelectedEvents,
  getShowProcessAlarmModalState,
} from "@/store/selectors/events";
import {
  setSelectedEvents,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import { DeviceEvent, ProcessStatus } from "@/types/device-event";
import { getFormattedDateTime } from "@/utils/get-formatted-date-time";

import {
  useDeleteMaskedItemMutation,
  useMaskItemMutation,
  useProcessEventMutation,
} from "@/services";
import { ReqProcessEvent } from "@/types/process-event";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  refetch: () => void;
};

type Fields = {
  processStatus: ProcessStatus;
  remarks: string;
  caseNumber: string;
};

const initialValues: Fields = {
  processStatus: ProcessStatus.Accomplished,
  remarks: "",
  caseNumber: "",
};

const { Item } = Form;
const { TextArea } = Input;

const processStatusOptions = [
  { label: "Pending", value: ProcessStatus.Pending },
  { label: "Dispatched", value: ProcessStatus.Dispatched },
  { label: "Accomplished", value: ProcessStatus.Accomplished },
];

export const ProcessAlarmMapModal: FC<Props> = ({ dataTestId, refetch }) => {
  const [handleProcessEvents] = useProcessEventMutation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<Fields>();
  const show = useAppSelector(getShowProcessAlarmModalState);
  const [event] = useAppSelector(getSelectedEvents);
  const processTime = event ? getFormattedDateTime(event.process.time) : "N/A";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [maskItem] = useMaskItemMutation();
  const handleMaskItem = async (record: DeviceEvent) => {
    const res = await maskItem({ keyId: record.systemId });
    if ("data" in res && res.data.error === 0) {
      refetch();
      messageApi.open({
        type: "success",
        content: "Masked Successfully !",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "There was an error",
      });
    }
  };

  const [deleteMasked] = useDeleteMaskedItemMutation();
  const handleRecovery = async (record: DeviceEvent) => {
    const res = await deleteMasked({
      keyId: record.systemId,
      type: record.type || 1,
    });
    if ("data" in res && res.data.error === 0) {
      refetch();
      messageApi.open({
        type: "success",
        content: "Recovered Successfully !",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "There was an error",
      });
    }
  };

  const handleClose = () => {
    dispatch(setShowProcesslarmModal(false));
    dispatch(setSelectedEvents([]));
  };

  useDidUpdate(() => {
    if (typeof event === "undefined") {
      return;
    }

    const { status, caseNum } = event.process;

    form.setFieldsValue({
      processStatus: status,
      caseNumber: caseNum,
    });
  }, [event]);
  const onSubmit = async () => {
    setIsLoading(true);
    const { caseNumber, processStatus, remarks } = form.getFieldsValue();
    const eventIds: any = [];
    eventIds.push(...eventIds, event.eventId);
    const body: ReqProcessEvent = {
      event: eventIds,
      processStatus,
      caseNumber: caseNumber,
      remarks: remarks,
    };
    const res = await handleProcessEvents(body);
    if (res) {
      setIsLoading(false);
      dispatch(setShowProcesslarmModal(false));
      if ("data" in res && res.data.error === 0) {
        refetch();
        messageApi.open({
          type: "success",
          content: "Process status updated",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Process status update failed",
        });
      }
    }
  };
  const antIcon = (
    <LoadingOutlined style={{ fontSize: "16px", color: "white" }} spin />
  );

  return (
    <>
      {contextHolder}
      <Drawer
        open={show}
        width={460}
        title="Acknowledge Alarm"
        extra={
          <Space>
            <Button
              type="default"
              style={{
                background: "transparent",
                borderRadius: "1px",
                borderColor: "#1B3687",
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>

            {isLoading ? (
              <Spin indicator={antIcon} />
            ) : (
              <Button
                type="primary"
                style={{ borderRadius: "1px" }}
                onClick={() => onSubmit()}
              >
                Confirm
              </Button>
            )}
          </Space>
        }
        destroyOnClose={true}
        onClose={handleClose}
        data-testid={dataTestId}
        style={{ background: " #0C183B" }}
      >
        <div className={styles.container}>
          <DescriptionList
            title="Process Info"
            items={[{ label: "Process Time", value: processTime }]}
            dataTestId="process-info-list"
          />
          <Form<Fields>
            form={form}
            layout="vertical"
            initialValues={initialValues}
            name="process-alarm"
            data-testid="process-alarm-form"
          >
            <Item<Fields> label="Status" name="processStatus">
              <Radio.Group
                className={"ant_radio_group"}
                options={processStatusOptions}
              />
            </Item>
            <Item<Fields> label="Case Number" name="caseNumber">
              <Input
                maxLength={32}
                placeholder="Netsuite Case Number"
                className={styles.ant_input}
              />
            </Item>
            <Item<Fields> label="Notes" name="remarks">
              <TextArea
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={256}
                showCount={true}
                placeholder="Process notes"
                className={styles.testingTextarea}
                // style={{backgroundColor: "yellow"}}
              />
            </Item>
          </Form>

          {event && (
            <>
              <AlarmInfoList
                onRecovery={handleRecovery}
                onMask={handleMaskItem}
                event={event}
                dataTestId="alarm-info-list"
              />
              <SiteInfoList site={event.site} dataTestId="site-info-list" />
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};
