/* eslint-disable react/destructuring-assignment */
import { type CSSProperties, type FC, Fragment } from "react";
import { theme, Typography } from "antd";
import type { ContentType } from "recharts/types/component/Tooltip";

type TooltipContentType = ContentType<
  number | string | Array<number | string>,
  string
>;

type RenderTooltipParams<T extends TooltipContentType = TooltipContentType> =
  T extends (...args: infer P) => void ? P[number] : never;

type Props = RenderTooltipParams;

const { Text } = Typography;

export const CustomTooltip: FC<Props> = ({ active, payload: data }) => {
  const {
    token: { colorBgElevated, boxShadowSecondary, borderRadiusSM, paddingXS },
  } = theme.useToken();

  const themedStyles: CSSProperties = {
    backgroundColor: colorBgElevated,
    padding: paddingXS,
    boxShadow: boxShadowSecondary,
    borderRadius: borderRadiusSM,
  };

  if (active && Array.isArray(data) && data.length > 0) {
    const { dataKey } = data[0];

    return (
      <div style={themedStyles}>
        {data.map(({ payload }) => {
          const { name } = payload;
          const value = payload[dataKey!];

          return (
            <Fragment key={`${name}-${value}`}>
              <Text>{name}</Text>
              <Text strong={true}>: {value}</Text>
            </Fragment>
          );
        })}
      </div>
    );
  }

  return null;
};
