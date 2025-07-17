import { memo, useContext } from "react";
import { theme } from "antd";
import clsx from "clsx";

import LogoImage from "./assets/logo.svg?react";

import styles from "./index.module.css";
import { ThemeContext } from "@/theme";

type Props = {
  className?: string;
  collapsed?: boolean;
};

export const Logo = memo<Props>(({ className, collapsed = false }) => {
  const {
    token: { colorText, motionEaseInOut },
  } = theme.useToken();

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <div
      className={clsx(className, styles.container)}
      style={{
        color: !darkTheme ? "#808080" : colorText,
        transitionTimingFunction: motionEaseInOut,
      }}
    >
      <LogoImage
        role="img"
        className={clsx(styles.logo, { [styles.collapsed]: collapsed })}
        aria-label="Service Plus"
      />
    </div>
  );
});
