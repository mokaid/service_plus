import { type FC, useContext } from "react";
import Icon from "@ant-design/icons";

import MoonIcon from "@/assets/moon.svg?react";
import SunIcon from "@/assets/sun.svg?react";
import { ThemeContext } from "@/theme";
import { HeaderButton } from "../header-button";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const ThemeSwitcher: FC<Props> = ({
  className,
  dataTestId = "theme-switcher",
}) => {
  const { appTheme, toggleAppTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const IconComponent = darkTheme ? SunIcon : MoonIcon;
  const label = darkTheme ? "Light Theme" : "Dark Theme";

  return (
    <HeaderButton
      label={label}
      className={className}
      icon={<Icon component={IconComponent} />}
      onClick={toggleAppTheme}
      data-testid={dataTestId}
    />
  );
};
