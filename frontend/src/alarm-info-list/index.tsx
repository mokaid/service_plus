import { Button, Space } from "antd";
import { type FC, useEffect, useMemo, useState } from "react";

import {
  useGetMaskedItemMutation
} from "@/services";
import { AlarmLevelTag } from "../components/alarm-level-tag";
import { DescriptionList, type DescriptionListItem } from "../description-list";
import type { DeviceEvent } from "../types/device-event";
import { getFormattedDateTime } from "../utils/get-formatted-date-time";

type Props = {
  event: DeviceEvent;
  className?: string;
  dataTestId?: string;
  onMask: (record: DeviceEvent) => Promise<void>;
  onRecovery: (record: DeviceEvent) => Promise<void>;
};

export const AlarmInfoList: FC<Props> = ({
  event,
  className,
  dataTestId,
  onMask,
  onRecovery,
}) => {
  const [isMasked, setMasked] = useState<boolean>();
  const [getMasked] = useGetMaskedItemMutation();

  // Handle masking
  const handleMask = async (event: DeviceEvent) => {
    await onMask(event); // Perform masking logic
    setMasked(true); // Update state to reflect the masking
  };

  // Handle recovery
  const handleRecovery = async (event: DeviceEvent) => {
    await onRecovery(event); // Perform recovery logic
    setMasked(false); // Update state to reflect the recovery
  };

  useEffect(() => {
    (async () => {
      const res = await getMasked({});
      if ('data' in res && res.data?.error == 0 && res.data?.data?.list) {
        const found = res.data?.data?.list
          ? res.data?.data?.list.filter((item: any) => item.keyId == event.obj.keyId)
          : false;
        if (found && found.length > 0) {
          setMasked(true);
        } else {
          setMasked(false);
        }
      }
    })();
  }, [event, onRecovery, onMask]);

  const items = useMemo<DescriptionListItem[]>(
    () => [
      { label: "System", value: event.vendor },
      { label: "Event ID", value: event.eventId },
      { label: "Object", value: event.obj.name },
      { label: "Priority", value: <AlarmLevelTag level={event.level} /> },
      {
        label: "Type",
        value: (
          <Space size="small">
            {isMasked ? (
              <Button
                size="small"
                type="primary"
                onClick={() => handleRecovery(event)}
              >
                Recovery
              </Button>
            ) : (
              <Button size="small" onClick={() => handleMask(event)}>
                Mask
              </Button>
            )}
          </Space>
        ),
      },
      { label: "Value", value: event.obj.value },
      { label: "Event Time", value: getFormattedDateTime(event.timeEvent) },
      { label: "Server Time", value: getFormattedDateTime(event.timeServer) },
      { label: "Description", value: event.obj.desc || "N/A" },
    ],
    [event, isMasked, onRecovery, onMask]
  );

  return (
    <DescriptionList
      className={className}
      title="Alarm Info"
      items={items}
      dataTestId={dataTestId}
    />
  );
};
