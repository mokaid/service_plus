import { Breadcrumbs } from "@/breadcrumbs";
import { AlarmSelfRecoveryTable } from "@/components/alarm-self-recovery-table";
import { ThemeContext } from "@/theme";
import { Col, Row } from "antd";
import { type FC, useContext } from "react";

export const AlarmSelfRecovery: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Breadcrumbs />
      </Col>
      <Col span={24}>
        <AlarmSelfRecoveryTable
          className={`${darkTheme ? "alerts_table" : ""}`}
          dataTestId={""}
          data={null}
          pageIndex={0}
          pageSize={0}
          totalAlerts={0}
          handlePageChange={function (): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
        />
      </Col>
    </Row>
  );
};
