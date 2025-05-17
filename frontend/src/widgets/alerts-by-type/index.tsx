import { type FC, useCallback } from "react";
import { Empty, Spin, theme } from "antd";
import { Bar, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ContentType } from "recharts/types/component/Label";

import { BaseBarChart } from "@/charts/base-bar-chart";
import {
  ChartContainer,
  type ChartContainerProps,
} from "@/charts/chart-container";

import { HorizontalBarGraphDataType } from "@/types/graph-data";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.module.css";


type Props = Pick<
  ChartContainerProps,
  "title" | "tooltipText" | "className" | "dataTestId"
> & {
  color?: string;
  data?: HorizontalBarGraphDataType[];
  isLoading?: boolean;
};

type RenderLabelParams<T extends ContentType = ContentType> = T extends (
  ...args: infer P
) => void
  ? P[number]
  : never;

export const AlertsByType: FC<Props> = ({
  className,
  title,
  tooltipText,
  dataTestId,
  color,
  data,
  isLoading,
}) => {
  const {
    token: { colorText },
  } = theme.useToken();

  const renderLabel = useCallback(
    (props: RenderLabelParams) => {
      const { value, y, height } = props;

      return (
        <text
          x={16}
          y={Number(y) + Number(height) / 2}
          fill={colorText}
          dominantBaseline="middle"
          fontSize={12}
        >
          {value}
        </text>
      );
    },
    [colorText],
  );

  return (
    <ChartContainer
      className={className}
      title={title}
      tooltipText={tooltipText}
      dataTestId={dataTestId}
    >
      {(!isLoading && data?.length) === 0 ? (
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
      ) : (
        <BaseBarChart layout="vertical" data={data}>
          <CartesianGrid stroke="white" />
          <XAxis type="number" dataKey="xAxisValue" fill="white" />
          <YAxis hide={true} dataKey="name" type="category" scale="auto" />

          <Bar dataKey="count" barSize={20} fill={color}>
            <LabelList
              dataKey="name"
              position="insideLeft"
              fill="white"
              content={renderLabel}
            />
          </Bar>
        </BaseBarChart>
      )}
    </ChartContainer>
  );
};
