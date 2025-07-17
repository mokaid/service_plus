import { Col, Row } from "antd";
import { useEffect, useState, type FC } from "react";
import { SiderTrigger } from "@/components/sider-trigger";
import { EditSiteMapModal } from "@/modals/edit-site-map-modal";
import { SiteInfoModal } from "@/modals/site-map-modal";
import { SiteMapComp } from "@/widgets/site-map";
import styles from "./index.module.css";
import {
  useGetSitesQuery,
  useGetUserAllowedSitesMutation,
  useQueryEventsMutation,
} from "@/services";
import { SiteInfo } from "@/modals/site-info-modal";
import { PermissionGuard } from "@/components/permission-guard";
import { useAppSelector } from "@/hooks/use-app-selector";
import { RootState } from "@/types/store";

export const SiteMap: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showOnlyDisconnected, setShowOnlyDisconnected] = useState(false);
  const [sitesData, setSitesData] = useState<any[]>([]);

  const site = useAppSelector((state: RootState) => state.sites);

  const user = useAppSelector((state: RootState) => state.authState.user);

  const {
    currentData: sites,
    isLoading: sitesLoading,
    refetch,
  } = useGetSitesQuery({});

  //USER ALLOWED SITES
  const [getUserAllowedSites, { isLoading: allowedSitesLoadaer }] =
    useGetUserAllowedSitesMutation();

  const handleAllowedSitesForCustomer = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });

    if ("data" in res) {
      const filteredSites: any[] = [];
      sites?.forEach((item: any) => {
        res?.data?.filter?.forEach((sites: any) => {
          const splittedValue = sites.orgId.split("0")[0];
          let newSiteId;
          if (splittedValue.length === 2) {
            newSiteId = `0${sites?.orgId}`;
          } else {
            newSiteId = `00${sites?.orgId}`;
          }

          if (newSiteId) {
            if (newSiteId === item?.id) {
              filteredSites.push(item);
            } else {
              return;
            }
          }
        });
      });

      setSitesData(filteredSites);
    }
  };

  useEffect(() => {
    if (user?.role === 99 && user?.permission) {
      handleAllowedSitesForCustomer();
    } else {
      setSitesData(sites);
    }
  }, [user, sites]);

  const handleCollapseMenu = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    // Cookies.set(SIDER_MENU_COLLAPSED_STATE_COOKIE, `${newCollapsed}`);
  };

  const [getEvents, { data: events, isLoading: MapLoader }] =
    useQueryEventsMutation();

  const filteredSitesByStatus = showOnlyDisconnected
    ? sites.filter((item: any) => item.connectionState == false)
    : sites;

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <PermissionGuard keyName="siteMap" action="v">
          <SiteMapComp sites={sites} allowedSites={sitesData} />
        </PermissionGuard>
      </Col>

      <SiderTrigger
        left={true}
        dataTestId="sider-trigger"
        onClick={handleCollapseMenu}
        collapsed={collapsed}
        className={`${styles.trigger} ${
          collapsed ? styles.trigger_expand : styles.trigger_collapse
        }`}
      />
      <SiteInfoModal
        sites={sitesData}
        selectedSiteId={site.selectedSite}
        collapse={collapsed}
        onClick={handleCollapseMenu}
      />
      <SiteInfo refetch={refetch} selectedSiteId={site.selectedSite} />
      <EditSiteMapModal
        site={sites}
        handlePageFilterDate={(startDate, endDate, levels) => {
          getEvents({
            startDate,
            endDate,
            levels,
          });
        }}
      />
    </Row>
  );
};
