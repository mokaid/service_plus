import { DisconnectedSitesTable } from "@/components/disconnected-sites-table";
import { ThemeContext } from "@/theme";
import { Col, Row } from "antd";
import { type FC, useContext } from "react";

export const DisconnectedSites: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <DisconnectedSitesTable
          className={`${darkTheme ? "alerts_table" : ""}`}
          dataTestId={""}
          loading={false}
        />
      </Col>
    </Row>
  );
};
