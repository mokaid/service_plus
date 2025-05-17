import type {
  CSSProperties,
  FC,
  KeyboardEvent,
  PropsWithChildren,
  ReactNode,
} from "react";
import { theme } from "antd";
import clsx from "clsx";

import styles from "./index.module.css";

type Props = PropsWithChildren<{
  className?: string;
  dataTestId?: string;
  extra?: ReactNode;
  onClick?: () => void;
}>;

export const ActionListItem: FC<Props> = ({
  className,
  extra,
  children,
  dataTestId,
  onClick,
}) => {
  const {
    token: {
      colorBorderSecondary,
      colorText,
      colorTextDescription,
      fontWeightStrong,
    },
  } = theme.useToken();

  const containerThemeStyles: CSSProperties = {
    borderColor: colorBorderSecondary,
  };

  const itemThemeStyles = {
    "--color": colorTextDescription,
    "--color-hover": colorText,
  } as CSSProperties;

  const extraThemeStyles: CSSProperties = {
    color: colorText,
    fontWeight: fontWeightStrong,
  };

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter") {
      handleClick();
    }
  };

  return (
    <li
      style={containerThemeStyles}
      className={clsx(className, styles.container)}
      data-testid={dataTestId}
    >
      <div
        className={styles.item}
        role="button"
        style={itemThemeStyles}
        onClick={() => onClick?.()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className={styles.content}>{children}</div>

        {extra && (
          <div className={styles.extra} style={extraThemeStyles}>
            {extra}
          </div>
        )}

        <i className={styles.arrow} />
      </div>
    </li>
  );
};
