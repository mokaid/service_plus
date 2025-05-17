import { Breadcrumbs } from "@/breadcrumbs";
import { AlarmSelfRecoverySiteTable } from "@/components/alarm-self-recovery-site-table";
import { ThemeContext } from "@/theme";
import { Col, Row } from "antd";
import { type FC, useContext, useState } from "react";

export const AlarmSelfRecoverySite: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handlePageChange = (page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const darkTheme = appTheme === "dark";
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Breadcrumbs />
      </Col>
      <Col span={24}>
        <AlarmSelfRecoverySiteTable
          className={`${darkTheme ? "alerts_table" : ""}`}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
          dataTestId={""}
          data={null}
          totalAlerts={0}
          loading={false}
        />
      </Col>
    </Row>
  );
};
