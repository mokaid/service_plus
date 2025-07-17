import { type FC, type ReactNode, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, type MenuProps } from "antd";
import { getItem } from "./utils";
import { ThemeContext } from "@/theme";

import MenuItem from "antd/es/menu/MenuItem";

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  disabled?: boolean;
  permissionKey?: string;
  action?: string;
  subNav?: NavItem[];
};

type MenuItem = Required<MenuProps>["items"][number];

export type NavigationProps = Pick<MenuProps, "mode"> & {
  items: NavItem[];
  className?: string;
  dataTestId?: string;
};

export const Navigation: FC<NavigationProps> = ({
  mode,
  items,
  className,
  dataTestId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = useMemo<MenuItem[]>(() => items.map(getItem), [items]);

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const handleSelect: MenuProps["onSelect"] = ({ key }) => {
    navigate(key);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    // console.log("click ", e);
  };

  return (
    <Menu
      role="navigation"
      theme={`${darkTheme ? "dark" : "light"}`}
      mode={mode}
      onSelect={handleSelect}
      onClick={onClick}
      className={className}
      // children={null}
      items={navItems}
      selectedKeys={[location.pathname]}
      data-testid={dataTestId}
      // style={{ background: "#0F1E4C !important" }}
    />
  );
};
