import type { FC } from "react";

import { BasePieChart } from "@/charts/base-pie-chart";
import {
  ChartContainer,
  type ChartContainerProps,
} from "@/charts/chart-container";
import { PieGraphDataType } from "@/types/graph-data";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import styles from "./index.module.css";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store";

type Props = Pick<
  ChartContainerProps,
  "title" | "tooltipText" | "className" | "dataTestId"
> & {
  centerText?: string;
  data?: any[];
  isLoading?: boolean;
  colors?: string[];
  legend?: boolean;
  retry?: boolean;
  refetch?: MutationTrigger<MutationDefinition<any, any, any, any, any>>;
  allowedSites?: string[];
  selectedSiteId?: string;
  setRetry?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AlertsByPriority: FC<Props> = ({
  className,
  title,
  tooltipText,
  dataTestId,
  centerText,
  data,
  isLoading,
  legend = true,
  retry,
  setRetry,
  refetch,
  allowedSites,
  selectedSiteId,
  colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"],
}) => {
  const totalCount = data?.reduce((total, item) => {
    return total + item.value;
  }, 0);

  const filters = useSelector((state: RootState) => state.filters);

  const handleRefetch = async () => {
    const res = await refetch?.({
      sites: filters.sites.length > 0 ? filters.sites : allowedSites,
    });
    if ((res as any)?.data.error === 0) {
      setRetry?.(false);
    }
  };

  return (
    <ChartContainer
      className={className}
      title={title}
      tooltipText={tooltipText}
      dataTestId={dataTestId}
    >
      {retry ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: " center",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={handleRefetch}
        >
          <ReloadOutlined style={{ fontSize: 24 }} />
          <p>Retry</p>
        </div>
      ) : !isLoading && data?.length === 0 ? (
        <div className={styles.loaderDiv}>
          {" "}
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : isLoading ? (
        <div className={styles.loaderDiv}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin={true} />}
          />
        </div>
      ) : totalCount === 0 ? (
        <div className={styles.loaderDiv}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <BasePieChart
          data={data}
          legend={legend}
          centerText={centerText}
          colors={colors}
          dataKey="value"
        />
      )}
    </ChartContainer>
  );
};
