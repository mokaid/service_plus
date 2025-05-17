import { FC } from "react";
import { theme } from "antd";
import { BarChart, CartesianGrid, Tooltip } from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

import { CustomTooltip } from "../custom-tooltip";

const defaultMargin = { top: 0, left: 0, right: 0, bottom: 0 };

export type BaseBarChartProps = CategoricalChartProps;

export const BaseBarChart: FC<BaseBarChartProps> = ({ children, ...props }) => {
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  return (
    <BarChart margin={defaultMargin} {...props}>
      <CartesianGrid stroke={colorBorderSecondary} />
      {children}
      <Tooltip cursor={false} content={<CustomTooltip />} />
    </BarChart>
  );
};
