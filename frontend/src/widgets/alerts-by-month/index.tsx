import type { FC } from "react";
import { Bar, Cell, Tooltip, XAxis, YAxis } from "recharts";

import { BaseBarChart } from "@/charts/base-bar-chart";
import { ChartContainer, ChartContainerProps } from "@/charts/chart-container";
import { Empty, Spin, theme } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";

type Props = Pick<
  ChartContainerProps,
  "title" | "tooltipText" | "className" | "dataTestId"
> & {
  centerText?: string;
  data?: any[];
  isLoading?: boolean;
  colors?: string[];
  priority?: boolean;
};

const COLORS = ["#5CDB1D", "#FBB62D", "#F63A44"];

export const AlertsByMonth: FC<Props> = ({
  className,
  title,
  tooltipText,
  dataTestId,
  data,
  isLoading,
  priority,
}) => {
  const {
    token: { colorBgElevated, boxShadowSecondary, borderRadiusSM, paddingXS },
  } = theme.useToken();

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
        <BaseBarChart
          data={data}
          margin={{
            top: 20,
          }}
        >
          <XAxis
            dataKey="name"
            angle={0}
            minTickGap={0}
            // axisLine={false}
          />
          <YAxis />
          {/* <Legend
            formatter={(value) => {
              // const total = data.reduce((sum, item) => sum + (item[value] || 0), 0);
              return `${value}`;
            }}
          /> */}

          <Tooltip
            contentStyle={{
              backgroundColor: colorBgElevated,
              border: 0,
              padding: paddingXS,
              boxShadow: boxShadowSecondary,
              borderRadius: borderRadiusSM,
            }}
            formatter={(value, name) => [`${value}`, name]}
          />
          {!priority && (
            <Bar dataKey="count" fill={COLORS[0]} label={{ position: "top" }} />
          )}
          {priority && (
            <Bar
              dataKey="count"
              fill="#00a0fc"
              stroke="#000000"
              strokeWidth={1}
            >
              {data?.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
              ))}
            </Bar>
          )}
          {/* <Bar dataKey="low" fill={COLORS[0]} />
          <Bar dataKey="medium" fill={COLORS[1]} />
          <Bar dataKey="high" fill={COLORS[2]} /> */}
        </BaseBarChart>
      )}
    </ChartContainer>
  );
};
