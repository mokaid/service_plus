import { type FC, useMemo } from "react";

import { DescriptionList, DescriptionListItem } from "@/description-list";
import { DeviceEvent } from "@/types/device-event";

type Props = {
  site?: DeviceEvent["site"];
  className?: string;
  dataTestId?: string;
};

export const SiteInfoList: FC<Props> = ({ site, className, dataTestId }) => {
  // TODO: Get rest info from BE
  const items = useMemo<DescriptionListItem[]>(
    () => [
      { label: "Site ID", value: site?.id || "N/A" },
      { label: "Site Name", value: site?.name || "N/A" },
      // { label: "Site Address", value: "N/A" },
      // { label: "Contact 1", value: "N/A" },
      // { label: "Contact 2", value: "N/A" },
    ],
    [site],
  );
  return (
    <DescriptionList
      className={className}
      title="Site Info"
      items={items}
      dataTestId={dataTestId}
    />
  );
};
