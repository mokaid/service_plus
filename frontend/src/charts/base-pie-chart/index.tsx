import { useContext, type FC } from "react";
import { theme } from "antd";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  type PieProps,
  Tooltip,
  Label,
} from "recharts";

import { CustomTooltip } from "../custom-tooltip";
import { ThemeContext } from "@/theme";
import { Tooltip as AntTooltip } from "antd";

export type BasePieChartProps = Pick<PieProps, "data" | "dataKey"> & {
  colors: string[];
  width?: number;
  height?: number;
  centerText?: string;
  legend?: boolean;
};

export const BasePieChart: FC<BasePieChartProps> = ({
  colors = [],
  data = [],
  dataKey,
  width,
  height,
  centerText,
  legend = true,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const visibleData = data.slice(0, 2);
  const remainingData = data.slice(2);

  const renderLegend = () => {
    return (
      <div>
        {visibleData.map((item, index) => (
          <div key={index} style={{ marginBottom: "4px", fontSize: "13px"  }}>
            <span style={{ color: colors[index % colors.length] }}>●</span>{" "}
            {item.name}: {item.value}
          </div>
        ))}
        {remainingData.length > 0 && (
          <AntTooltip
            title={
              <div style={{ padding: "6px" }}>
                {remainingData.map((item, index) => (
                  <div key={index} style={{ marginBottom: "4px", fontSize: "13px"  }}>
                    <span style={{ color: colors[(index + visibleData.length) % colors.length] }}>●</span>{" "}
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
            }
            overlayStyle={{ maxWidth: "300px" }}
          >
            <div style={{ color: colors[2 % colors.length], cursor: "pointer", fontSize: "13px" }}>
              +{remainingData.length} more items
            </div>
          </AntTooltip>
        )}
      </div>
    );
  };

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        dataKey={dataKey}
        stroke={colorBgContainer}
        cornerRadius={5}
        startAngle={90}
        endAngle={480}
        innerRadius={40}
      >
        <>
          <Label
            value={centerText}
            position="center"
            fontSize={30}
            fill={darkTheme ? "white" : "black"}
            fontWeight="500"
          />
          {data.map((_entry, index) => {
            const key = `cell-${index}`;
            return <Cell key={key} fill={colors[index % colors.length]} />;
          })}
        </>
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      {legend && <Legend align="center" content={renderLegend} />}
    </PieChart>
  );
};
