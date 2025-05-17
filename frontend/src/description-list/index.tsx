import type { CSSProperties, FC, ReactNode } from "react";
import { ConfigProvider, theme, type ThemeConfig, Typography } from "antd";
import clsx from "clsx";

import styles from "./index.module.css";

export type DescriptionListItem = {
  label: string;
  value: ReactNode;
};

export type DescriptionListProps = {
  items: DescriptionListItem[];
  title?: ReactNode;
  style?: CSSProperties;
  className?: string;
  dataTestId?: string;
};

const { Title } = Typography;

const themeConfig: ThemeConfig = {
  components: {
    Tag: {
      marginXS: 0,
    },
  },
};

export const DescriptionList: FC<DescriptionListProps> = ({
  style,
  title,
  items,
  className,
  dataTestId,
}) => {
  const {
    token: { colorTextDescription },
  } = theme.useToken();

  const labelThemedStyles: CSSProperties = { color: colorTextDescription };

  return (
    <section
      className={clsx(className, styles.container)}
      data-testid={dataTestId}
      style={style}
    >
      {title && <Title level={5}>{title}</Title>}
      <ConfigProvider theme={themeConfig}>
        {items?.map(({ label, value }) => (
          <div key={label} className={styles.item}>
            <div role="term" className={styles.label} style={labelThemedStyles}>
              {label}
            </div>
            <div role="definition" className={styles.value}>
              {value}
            </div>
          </div>
        ))}
      </ConfigProvider>
    </section>
  );
};
