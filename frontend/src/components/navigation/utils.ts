import { isFilledArray } from "@mvp-tech/utils";
import type { MenuProps } from "antd";

import type { NavigationProps } from ".";

type NavItem = NavigationProps["items"][number];
type MenuItem = Required<MenuProps>["items"][number];

export function getItem({
  label,
  icon,
  disabled,
  href,
  subNav,
}: NavItem): MenuItem {
  const children = isFilledArray(subNav) ? subNav.map(getItem) : undefined;

  return {
    label,
    icon,
    disabled,
    children,
    key: href,
  };
}

export const splitName = (name: string) => {
  return name.split(" ");
};

export function getOfflineSystemsCount(data: any) {
  const result: Record<string, number> = {};
  if (!data?.site) return result;
  data.site.forEach((site: { system?: any[] }) => {
    if (site.system && Array.isArray(site.system)) {
      site.system.forEach(
        (system: { systemName: string; object?: { offline?: number } }) => {
          const name = system.systemName;
          const offlineCount = system.object?.offline || 0;
          if (result[name]) {
            result[name] += offlineCount;
          } else {
            result[name] = offlineCount;
          }
        },
      );
    }
  });

  return result;
}
export function getSelectedSiteOfflineSystemsCount(data: any) {
  const result: Record<string, number> = {};
  if (!data) return result;
  data.forEach((item: any) => {
    if (item.system && Array.isArray(item.system)) {
      item.system.forEach(
        (system: { systemName: string; object?: { offline?: number } }) => {
          const name = system.systemName;
          const offlineCount = system.object?.offline || 0;
          if (result[name]) {
            result[name] += offlineCount;
          } else {
            result[name] = offlineCount;
          }
        },
      );
    }
  });

  return result;
}

export function getTotalSystemsCount(data: any) {
  const result: Record<string, number> = {};
  if (!data?.site) return result;
  data.site.forEach((site: { system?: any[] }) => {
    if (site.system && Array.isArray(site.system)) {
      site.system.forEach(
        (system: { systemName: string; object?: { total?: number } }) => {
          const name = system.systemName;
          const totalCount = system.object?.total || 0;
          if (result[name]) {
            result[name] += totalCount;
          } else {
            result[name] = totalCount;
          }
        },
      );
    }
  });

  return result;
}

export async function getTotalDeviceAlerts(data: any) {
  let result: any[] = [];
  if (!data) return result;
  data.forEach((device: any) => {
    const name = device.name.split(" @")[1].trim();

    const totalCount = device.count || 0;

    const sameDevices = result.find((item) => item.name === name);
    if (sameDevices) {
      result = [
        ...result.filter((item) => item.name !== name),
        { name: name, count: sameDevices.count + totalCount },
      ];
    } else {
      result.push({ name: name, count: totalCount });
    }
  });

  return result;
}

export const splitId = (id: string, orgId?: string) => {
  const matchId = `${orgId}00`;
  if (id.includes(matchId)) {
    const newId = id.split(matchId)[1];
    if (newId.length === 2) {
      return `0${newId}`;
    } else if (newId.length === 1) {
      return `00${newId}`;
    } else {
      return newId;
    }
  } else {
    return id;
  }
};
