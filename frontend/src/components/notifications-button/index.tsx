import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationOutlined } from "@ant-design/icons";
import { Badge } from "antd";

import { AppRoute } from "@/routes/routes";
import { HeaderButton } from "../header-button";
import { useGetSitesQuery } from "@/services";
import warningAudio from "../../assets/audios/y1184.mp3";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const NotificationsButton: FC<Props> = ({
  className,
  dataTestId = "notification-button",
}) => {
  const navigate = useNavigate();
  const [newNotification, setNewNotification] = useState<boolean>(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalItems, setTotalItems] = useState(0);

  const [siteLoading, setSiteLoading] = useState<boolean>(false);

  const [disconnectedSites, setDisconnectedSites] = useState<any[]>([]);

  const { currentData, isLoading, refetch } = useGetSitesQuery({
    connectionState: 0,
    pageIndex,
    pageSize,
  });

  useEffect(() => {
    const interval = setInterval(refetch, 10000);

    if (disconnectedSites.length !== (currentData || []).length) {
      if (
        disconnectedSites.length < (currentData || []).length &&
        disconnectedSites.length !== 0
      ) {
        setNewNotification(true);
        const audio = new Audio(warningAudio);
        audio.play();
      }
      setDisconnectedSites(currentData);
      setTotalItems(currentData.length);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentData]);

  const handleClick = () => {
    navigate(AppRoute.DisconnectedSites);
    setNewNotification(false);
  };

  return (
    <HeaderButton
      label="Notifications"
      className={className}
      icon={
        <Badge size="small" dot={newNotification}>
          <NotificationOutlined />
        </Badge>
      }
      onClick={handleClick}
      data-testid={dataTestId}
    />
  );
};
