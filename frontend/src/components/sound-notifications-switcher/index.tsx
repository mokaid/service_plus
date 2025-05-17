import { type FC, useState } from "react";
import { SoundOutlined } from "@ant-design/icons";
import clsx from "clsx";

import { HeaderButton } from "../header-button";

import styles from "./index.module.css";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const SoundNotificationsSwitcher: FC<Props> = ({
  className,
  dataTestId = "sound-notifications-switcher",
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const label = soundEnabled ? "Mute" : "Unmute";

  const toggleSoundEnabled = () => {
    setSoundEnabled((prevSoundEnabled) => !prevSoundEnabled);
  };

  return (
    <HeaderButton
      label={label}
      className={clsx(className, styles.container, {
        [styles.disabled]: !soundEnabled,
      })}
      icon={<SoundOutlined />}
      onClick={toggleSoundEnabled}
      dataTestId={dataTestId}
    />
  );
};
