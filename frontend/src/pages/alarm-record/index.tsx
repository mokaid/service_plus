import { type FC, useState, useContext } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tabs, type TabsProps } from "antd";

import { Breadcrumbs } from "@/breadcrumbs";
import { AlarmRecordCharts } from "@/components/alarm-record-charts";
import { AlarmRecordGrid } from "@/components/alarm-record-grid";
import { ThemeContext } from "@/theme";
import { AllAlerts } from "@/components/all-alerts";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setShowEventsFilterModal } from "@/store/slices/events";
import { setShowDateFilter } from "@/store/slices/sites";

const items: TabsProps["items"] = [
  {
    key: "grid",
    label: "Grid",
    // children: <AlarmRecordGrid />,
    children: <AllAlerts />,
  },
  {
    key: "chart",
    label: "Chart",
    children: <AlarmRecordCharts />,
  },
];

export const AlarmRecord: FC = () => {
  const [selectedTab, setSelectedTab] = useState("grid");
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const dispatch = useAppDispatch();

  const handleTabChange = (key: any) => {
    setSelectedTab(key);
  };

  const handleFilterClick = () => {
    dispatch(setShowEventsFilterModal(true));
    dispatch(setShowDateFilter(false));
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Breadcrumbs />
      </Col>

      <Col span={24}>
        <Tabs
          type="card"
          // className="tabs"
          className={`${
            darkTheme && selectedTab === "grid"
              ? "tabs tabs_dark_grid"
              : darkTheme && selectedTab === "chart"
              ? "tabs tabs_dark_chart"
              : !darkTheme && selectedTab === "chart"
              ? "tabs_light tabs_light_chart"
              : "tabs_light tabs_light_grid"
          }`}
          items={items}
          activeKey={selectedTab}
          onChange={handleTabChange}
          // tabBarExtraContent={
          //   selectedTab === "chart"
          //     ? {
          //         right: (
          //           <Button
          //             onClick={() => handleFilterClick()}
          //             className={`filter_btn ${
          //               darkTheme ? "filter_btn_bg" : ""
          //             }`}
          //             icon={<FilterOutlined />}
          //           >
          //             Filter
          //           </Button>
          //         ),
          //       }
          //     : null
          // }
        />
      </Col>
    </Row>
  );
};
