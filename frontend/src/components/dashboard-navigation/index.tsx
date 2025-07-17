import {
  AimOutlined,
  AlertOutlined,
  BellOutlined,
  CloudUploadOutlined,
  ControlOutlined,
  DashboardOutlined,
  DisconnectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Spin, type ThemeConfig } from "antd";
import { useEffect, useMemo, useState, type FC } from "react";

import { useAppSelector } from "@/hooks/use-app-selector";
import { AlarmRoute, AppRoute } from "@/routes/routes";
import { User } from "@/types/user";
import { getFilteredNavItems } from "@/utils/filteredRoutes";
import { Navigation, type NavigationProps } from "../navigation";

type Props = {
  className?: string;
  dataTestId?: string;
};

const AdminNagivation: NavigationProps["items"] = [
  {
    label: "Users",
    href: AppRoute.Users,
    icon: <UserOutlined aria-hidden={true} />,
  },
];

const themeConfig: ThemeConfig = {
  components: {
    Menu: {
      darkItemSelectedBg: "rgba(17, 26, 44, 1)",
      darkItemSelectedColor: "rgba(9, 109, 217, 1)",
      darkSubMenuItemBg: "rgba(12, 24, 59, 1)",
      horizontalItemBorderRadius: 1,
    },
  },
};

const navItems: NavigationProps["items"] = [
  {
    label: "Home",
    href: AppRoute.Dashboard,
    icon: <DashboardOutlined aria-hidden={true} />,
    permissionKey: "dashboard",
    action: "v",
  },
  {
    label: "Alarm",
    href: AppRoute.Alarm,
    icon: <AlertOutlined aria-hidden={true} />,
    permissionKey: "alarmparent",
    action: "v",
    subNav: [
      {
        label: "Record",
        href: `${AppRoute.Alarm}/${AlarmRoute.Record}`,
        permissionKey: "record",
        action: "v",
      },
      {
        label: "Quick Recovery",
        href: `${AppRoute.Alarm}/${AlarmRoute.SelfRecovery}`,
        permissionKey: "quickly",
        action: "v",
      },
    ],
  },
  {
    label: "Site Map",
    href: AppRoute.SiteMap,
    icon: <AimOutlined aria-hidden={true} />,
    permissionKey: "sitemap",
    action: "v",
  },
  {
    label: "Site Configuration",
    href: AppRoute.SiteConfiguration,
    icon: <ControlOutlined aria-hidden={true} />,
    permissionKey: "siteconfiguration",
    action: "v",
  },
  {
    label: "Site Upgrade",
    href: AppRoute.SiteUpgrade,
    icon: <CloudUploadOutlined aria-hidden={true} />,
    permissionKey: "siteupgrade",
    action: "v",
  },
  {
    label: "Masked Source",
    href: AppRoute.MaskedSource,
    icon: <BellOutlined aria-hidden={true} />,
    permissionKey: "masksource",
    action: "v",
  },
  {
    label: "Disconnected Sites",
    href: AppRoute.DisconnectedSites,
    icon: <DisconnectOutlined aria-hidden={true} />,
    permissionKey: "disconnect",
    action: "v",
  },
];

export const DashboardNavigation: FC<Props> = ({
  className,
  dataTestId = "dashboard-navigation",
}) => {
  const user = useAppSelector((state) => state.authState.user as User);
  const [loading, setLoading] = useState(true);

  const filteredItems = useMemo(() => {
    let items: any = [];
    if (!user?.sysRole) {
      return [];
    }
    if (user?.permission) {
      items = [...getFilteredNavItems(user, navItems)];
    } else if (user?.permission === undefined) {
      items = [...getFilteredNavItems(user, navItems), ...AdminNagivation];
    } else {
      items = [];
    }
    setLoading(false);
    return items;
  }, [user]);

  if (loading) {
    return <Spin style={{ width: "100%", marginTop: 32 }} />;
  }

  if (filteredItems.length === 0) return null;

  return (
    <ConfigProvider theme={themeConfig}>
      <Navigation
        className={className}
        mode="vertical"
        items={filteredItems ?? []}
        dataTestId={dataTestId}
      />
    </ConfigProvider>
  );
};
