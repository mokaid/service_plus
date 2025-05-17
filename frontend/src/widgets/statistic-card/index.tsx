import { Card, Typography } from "antd";
import styles from "./index.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/theme";

type Props = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  small?: boolean;
  loading?: boolean;
};

export const StatisticCard = ({
  icon,
  title,
  value,
  color,
  small = false,
  loading = false,
}: Props) => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <Card
      loading={loading}
      bordered={false}
      className={`${darkTheme ? styles.darkBg : styles.lightBg}`}
      bodyStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div
        className={`${styles.titleContainer} ${small ? styles.smaller : ""}`}
      >
        {icon}
        <Typography.Title className={styles.title}>{title}</Typography.Title>
      </div>
      <Typography.Title
        className={styles.value}
        style={color ? { color: color } : {}}
      >
        {value}
      </Typography.Title>
    </Card>
  );
};
