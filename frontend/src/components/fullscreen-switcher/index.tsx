import { type FC } from "react";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useFullscreen } from "rooks";

import { HeaderButton } from "../header-button";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const FullScreenSwitcher: FC<Props> = ({
  className,
  dataTestId = "full-screen-switcher",
}) => {
  const { isFullscreenAvailable, isFullscreenEnabled, toggleFullscreen } =
    useFullscreen();

  if (!isFullscreenAvailable) {
    return null;
  }

  const label = isFullscreenEnabled ? "Exit full screen" : "Full screen";

  const icon = isFullscreenEnabled ? (
    <FullscreenExitOutlined />
  ) : (
    <FullscreenOutlined />
  );

  return (
    <HeaderButton
      label={label}
      className={className}
      icon={icon}
      onClick={toggleFullscreen}
      dataTestId={dataTestId}
    />
  );
};
