import type { FC, ReactElement } from "react";
import clsx from "clsx";
import { ResponsiveContainer } from "recharts";

import { Widget, type WidgetProps } from "@/components/widget";

import styles from "./index.module.css";

export type ChartContainerProps = WidgetProps;

export const ChartContainer: FC<ChartContainerProps> = ({
  children,
  contentClassName,
  ...props
}) => (
  <Widget contentClassName={clsx(contentClassName, styles.chart)} {...props}>
    <ResponsiveContainer width="100%" height="100%">
      {children as ReactElement}
    </ResponsiveContainer>
  </Widget>
);
