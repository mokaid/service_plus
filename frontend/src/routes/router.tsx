import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { DashboardLayout } from "@/components/dashboard-layout";
import { AlarmRecord } from "@/pages/alarm-record";
import { Dashboard } from "@/pages/dashboard";

import { AlarmRoute, AlertRoute, AppRoute } from "./routes";
import { AlertMap } from "@/pages/alert-map";
import { AlarmSelfRecovery } from "@/pages/alarm-self-recovery";
import { AlarmSelfRecoverySite } from "@/pages/alarm-self-recovery-site";
import { SiteConfiguration } from "@/pages/site-configuration";
import { MaskedSource } from "@/pages/masked-source";
import { DisconnectedSites } from "@/pages/disconnected-sites";
import { SiteMap } from "@/pages/site-map";
import SignIn from "@/pages/auth/signin";
import { Users } from "@/pages/users";
import AuthProvider from "@/providers/AuthProvider";
import { useAppSelector } from "@/hooks/use-app-selector";
import { SiteUpgrade } from "@/pages/site-upgrade";
// import { useAppSelector } from "../hooks/use-app-selector";
// import { getAlertMapId } from "../store/selectors/events";

// const siteId = useAppSelector(getAlertMapId);
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.authState.token);
  return token ? <Navigate to={AppRoute.Dashboard} replace /> : <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthGuard><SignIn/></AuthGuard>,
  },
  {
    path: AppRoute.Home,
    element: <AuthProvider><DashboardLayout /></AuthProvider>,
    // errorElement: <>TODO: Add 404 page</>,
    handle: {
      crumb: () => ({
        title: "Home",
      }),
    },
    children: [
      {
        path: "",
        element: <Navigate to={AppRoute.Dashboard} replace={true} />
      },
      {
        path: AppRoute.Dashboard,
        element: <Dashboard />,
      },
      {
        path: AppRoute.Users,
        element: <Users />,
        handle: {
          crumb: () => ({
            title: "Users",
          }),
        },
      },
      {
        path: AlertRoute.alertMap,
        element: <AlertMap />,
        index: true,
        handle: {
          crumb: () => {
            const searchParams = new URLSearchParams(window.location.search);
            // Return a dynamic breadcrumb title using the 'name' parameter

            return {
              title: searchParams.get("title") || "",
            };
          },
        },
      },
      {
        path: AppRoute.Alarm,
        element: <Outlet />,
        handle: {
          crumb: () => ({
            title: "Alarm",
          }),
        },
        children: [
          {
            path: "",
            element: <Navigate to={AlarmRoute.Record} replace={true} />,
          },
          {
            path: AlarmRoute.Record,
            element: <AlarmRecord />,
            index: true,
            handle: {
              crumb: () => ({
                title: "Record",
              }),
            },
          },
          {
            path: AlarmRoute.SelfRecovery,
            element: <AlarmSelfRecovery />,
            handle: {
              crumb: () => ({
                title: "Quick Recovery",
              }),
            },
          },
          {
            path: AlarmRoute.SelfRecoverySite,
            element: <AlarmSelfRecoverySite />,
            index: true,
            handle: {
              crumb: () => {
                const searchParams = new URLSearchParams(
                  window.location.search,
                );
                // Return a dynamic breadcrumb title using the 'name' parameter

                return {
                  title: searchParams.get("title") || "",
                };
              },
            },
          },
        ],
      },
      {
        path: AppRoute.SiteMap,
        element: <SiteMap/>,
        handle: {
          crumb: () => ({
            title: "Site Map",
          }),
        },
      },
      {
        path: AppRoute.SiteUpgrade,
        element: <SiteUpgrade />,
        handle: {
          crumb: () => ({
            title: "Site Upgrade",
          }),
        },
      },
      {
        path: AppRoute.SiteConfiguration,
        element: <SiteConfiguration />,
        handle: {
          crumb: () => ({
            title: "Site Configuration",
          }),
        },
      },
      {
        path: AppRoute.MaskedSource,
        element: <MaskedSource/>,
      },
      {
        path: AppRoute.DisconnectedSites,
        element: <DisconnectedSites/>,
      },
      {
        path: AppRoute.Notifications,
        element: "Notifications",
      },
    ],
  },
]);
