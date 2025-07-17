import { ThemeContext } from "@/theme";
import { LoadingOutlined } from "@ant-design/icons";
import { Empty, Spin, Typography } from "antd";
import { useContext, type FC } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  PieProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../chart-container";
import { CustomTooltip } from "../custom-tooltip";
import styles from "./index.module.css";

type Rectification = {
  name: string;
  rectification_time: string;
};

export type BasePieChartProps = Pick<PieProps, "data" | "dataKey"> & {
  colors: string[];
  width?: number;
  height?: number;
  centerText?: string;
  title: string;
  stroke: string;
  fill: string;
  data: Rectification[];
  isLoading: boolean;
};

const formatTime = (seconds: number) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(Math.ceil(seconds % 60));
  return `${hrs}:${mins}:${secs}`;
};

const findWithLeastSeconds = (data: any) => {
  if (data.length > 0) {
    const sum = data.reduce((total: any, a: any) => {
      return total + a.seconds;
    }, 0);
    return sum / data.length;
  } else {
    return 0;
  }
};

export const BaseAreaChart: FC<BasePieChartProps> = ({
  title,
  width,
  height,
  stroke,
  fill,
  data,
  isLoading,
}) => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const filtered_data = data ? data : [];

  return (
    <ChartContainer
      className={`${darkTheme ? styles.darkBg : styles.lightBg}`}
      title={title}
      extraAddon={
        <Typography.Text style={{ fontWeight: "bolder", color: fill }}>
          {formatTime(findWithLeastSeconds(filtered_data))}
        </Typography.Text>
      }
    >
      {!isLoading && (data || []).length === 0 ? (
        <div className={styles.loaderDiv}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : isLoading ? (
        <div className={styles.loaderDiv}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin={true} />}
          />
        </div>
      ) : (
        <div style={{ height: height, width: width }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={width}
              height={height}
              data={filtered_data}
              margin={{
                top: 10,
                right: 30,
                left: 6,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id={`colorGradient-${fill}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={fill} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={fill} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatTime} />
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              <Area
                data={filtered_data}
                type="monotone"
                dot={false}
                dataKey="seconds"
                stroke={stroke}
                strokeWidth={2}
                fill={`url(#colorGradient-${fill})`}
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartContainer>
  );
};
