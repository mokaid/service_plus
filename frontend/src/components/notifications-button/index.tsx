import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationOutlined } from "@ant-design/icons";
import { Badge } from "antd";

import { AppRoute } from "@/routes/routes";
import { HeaderButton } from "../header-button";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const NotificationsButton: FC<Props> = ({
  className,
  dataTestId = "notification-button",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(AppRoute.DisconnectedSites);
  };

  const count = 1;

  return (
    <HeaderButton
      label="Notifications"
      className={className}
      icon={
        <Badge size="small" dot={count > 0}>
          <NotificationOutlined />
        </Badge>
      }
      onClick={handleClick}
      data-testid={dataTestId}
    />
  );
};
