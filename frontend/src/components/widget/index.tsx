import type { CSSProperties, FC, PropsWithChildren, ReactNode } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { theme, Tooltip, Typography } from "antd";
import clsx from "clsx";

import styles from "./index.module.css";

const { useToken } = theme;

export type WidgetProps = PropsWithChildren<{
  className?: string;
  title?: string;
  tooltipText?: string;
  headerClassName?: string;
  contentClassName?: string;
  round?: boolean;
  extraAddon?: ReactNode;
  dataTestId?: string;
}>;

export const Widget: FC<WidgetProps> = ({
  className,
  title,
  children,
  tooltipText,
  headerClassName,
  contentClassName,
  extraAddon,
  round = true,
  dataTestId,
}) => {
  const {
    token: { colorBgContainer, colorIcon, borderRadiusLG },
  } = useToken();

  const themeStyle: CSSProperties = {
    backgroundColor: colorBgContainer,
    borderRadius: round ? borderRadiusLG : undefined,
  };

  return (
    <section
      style={themeStyle}
      className={clsx(className, styles.container)}
      data-testid={dataTestId}
    >
      {title && (
        <header className={clsx(styles.header, headerClassName)}>
          <Typography.Title level={5} className={styles.title}>
            {title}
            {tooltipText && (
              <Tooltip title={tooltipText}>
                <InfoCircleOutlined
                  className={styles.tooltipIcon}
                  style={{ color: colorIcon }}
                />
              </Tooltip>
            )}
          </Typography.Title>

          {extraAddon && <div>{extraAddon}</div>}
        </header>
      )}

      <div className={clsx(contentClassName, styles.content)}>{children}</div>
    </section>
  );
};
