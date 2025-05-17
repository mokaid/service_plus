import type { CSSProperties, FC } from "react";
import { theme } from "antd";
import clsx from "clsx";
import type { LegendProps } from "recharts";
import type { Payload } from "recharts/types/component/DefaultLegendContent";

import styles from "./index.module.css";

type Props = Pick<LegendProps, "align" | "className"> & {
  payload?: Payload[];
  dataTestId?: string;
};

export const CustomLegend: FC<Props> = ({
  className,
  payload = [],
  align = "center",
  dataTestId,
}) => {
  const {
    token: { colorTextDescription },
  } = theme.useToken();

  const itemThemeStylesStyles: CSSProperties = { color: colorTextDescription };

  return (
    <ul
      className={clsx(className, styles.container, styles[align])}
      data-testid={dataTestId}
    >
      {payload.map((entry, index) => (
        <li
          className={styles.item}
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          style={itemThemeStylesStyles}
        >
          <i
            className={styles.icon}
            style={{ backgroundColor: entry.color }}
            aria-hidden={true}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};
