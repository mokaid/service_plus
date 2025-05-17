import  { type CSSProperties, type FC,useContext} from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { theme } from "antd";
import clsx from "clsx";

import styles from "./index.module.css";
import { ThemeContext } from "@/theme";

type Props = {
  collapsed: boolean;
  className?: string;
  dataTestId?: string;
  onClick: (collapsed: boolean) => void;
  left?:boolean
};

export const SiderTrigger: FC<Props> = ({
  className,
  collapsed,
  dataTestId,
  onClick,
  left
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";


  const containerThemeStyles = { "--color": colorBgContainer } as CSSProperties;
  const transform = left ? 'rotate(180deg)' : 'rotate(0deg)';

  const handleClick = () => {
    onClick(!collapsed);
  };

  return (
    <button
      type="button"
      style={containerThemeStyles}
      className={clsx(className, `${styles.container} ${left ? styles.bg_dark : !left && darkTheme ? styles.common_bg_dark : styles.common_bg_light }`)}
      onClick={handleClick}
      aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
      data-testid={dataTestId}
    >
      {collapsed  ? <RightOutlined style={{transform:transform}} /> : <LeftOutlined style={{transform:transform}} />}
    </button>
  );
};
