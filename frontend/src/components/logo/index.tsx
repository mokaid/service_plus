import { memo } from "react";
import { theme } from "antd";
import clsx from "clsx";

import LogoImage from "./assets/logo.svg?react";

import styles from "./index.module.css";

type Props = {
  className?: string;
  collapsed?: boolean;
};

export const Logo = memo<Props>(({ className, collapsed = false }) => {
  const {
    token: { colorText, motionEaseInOut },
  } = theme.useToken();

  return (
    <div
      className={clsx(className, styles.container)}
      style={{ color: colorText, transitionTimingFunction: motionEaseInOut }}
    >
      <LogoImage
        role="img"
        className={clsx(styles.logo, { [styles.collapsed]: collapsed })}
        aria-label="Service Plus"
      />
    </div>
  );
});
