import { Col, Row } from "antd";
import { useState, type FC } from "react";
import { SiderTrigger } from "@/components/sider-trigger";
import { EditSiteMapModal } from "@/modals/edit-site-map-modal";
import { SiteInfoModal } from "@/modals/site-map-modal";
import { SiteMapComp } from "@/widgets/site-map";
import styles from "./index.module.css";
import { useGetSitesQuery, useQueryEventsMutation } from "@/services";
import { EditSiteModal } from "@/modals/edit-site-modal";
import { SiteInfo } from "@/modals/site-info-modal";
import { PermissionGuard } from "@/components/permission-guard";

export const SiteMap: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showOnlyDisconnected, setShowOnlyDisconnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>();

  const {
    currentData: sites,
    isLoading: sitesLoading,
    refetch,
  } = useGetSitesQuery({});
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
          <SiteMapComp sites={sites} />
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
        sites={sites}
        collapse={collapsed}
        onClick={handleCollapseMenu}
      />
      <SiteInfo refetch={refetch} />
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
