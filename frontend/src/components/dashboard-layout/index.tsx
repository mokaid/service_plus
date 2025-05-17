import { type FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { ConfigProvider, Layout, Space, theme } from "antd";
import Cookies from "js-cookie";

import { SIDER_MENU_COLLAPSED_STATE_COOKIE } from "@/const/cookies";
import { ThemeContext } from "@/theme";
import { DashboardNavigation } from "../dashboard-navigation";
import { FullScreenSwitcher } from "../fullscreen-switcher";
import { Logo } from "../logo";
import { NotificationsButton } from "../notifications-button";
import { SiderTrigger } from "../sider-trigger";
import { SoundNotificationsSwitcher } from "../sound-notifications-switcher";
import { ThemeSwitcher } from "../theme-switcher";
import { UserPanel } from "../user-panel";
import DateTime from "../headerDateTime";

import styles from "./index.module.css";

const { Header, Content, Sider } = Layout;

const initialCollapsed =
  Cookies.get(SIDER_MENU_COLLAPSED_STATE_COOKIE) === "true";

export const DashboardLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleCollapseMenu = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    Cookies.set(SIDER_MENU_COLLAPSED_STATE_COOKIE, `${newCollapsed}`);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            algorithm: true,
          },
        },
      }}
    >
      <Layout className={styles.container}>
        {/* Fake sider to avoid using margins and flickering animations */}
        <Sider
          className={styles.fakeSider}
          collapsible={true}
          collapsed={collapsed}
          trigger={null}
          aria-hidden={true}
        />

        <Sider
          className={`${styles.sider} ${
            darkTheme ? styles.sider_bg : styles.sider_light
          }`}
          theme={appTheme}
          collapsible={true}
          collapsed={collapsed}
          onCollapse={handleCollapseMenu}
          trigger={null}
        >
          <Logo collapsed={collapsed} className={styles.logo} />
          <DashboardNavigation
            className={`${darkTheme ? styles.menu_bg : ""}`}
          />
          <SiderTrigger
            className={styles.trigger}
            collapsed={collapsed}
            onClick={handleCollapseMenu}
            dataTestId="sider-trigger"
          />
        </Sider>

        <Layout>
          <Header
            className={`${styles.header} ${
              darkTheme ? styles.header_darkBg : styles.header_lightBg
            }`}
            style={{ backgroundColor: colorBgContainer }}
          >
            <Space align="center" className={styles.controls}>
              <DateTime />
              <ThemeSwitcher />
              {/* <SoundNotificationsSwitcher /> */}
              <FullScreenSwitcher />
              <NotificationsButton />
              <UserPanel className={styles.userPanel} />
            </Space>
          </Header>

          <Content
            className={darkTheme ? styles.content : styles.light_content}
            data-testid="main-content"
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
