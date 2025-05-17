import { Col, Row } from "antd";
import type { FC } from "react";
import { Breadcrumbs } from "@/breadcrumbs";
import { AllAlertsMap } from "@/components/all-alert-map";


export const AlertMap: FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Breadcrumbs />
      </Col>
      <Col span={24}>
        <AllAlertsMap />
      </Col>
    </Row>
  );
};
