import { type FC, useState } from "react";
import { List, Popover, Space } from "antd";
import clsx from "clsx";

import { UserAvatar } from "../user-avatar";

import styles from "./index.module.css";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { logout } from "@/store/slices/authSlice";
import { useAppSelector } from "@/hooks/use-app-selector";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const UserPanel: FC<Props> = ({
  className,
  dataTestId = "user-avatar",
}) => {
  const [open, setOpen] = useState(false);
  const username = useAppSelector(
    (state) => state.authState.user?.userName as string,
  );

  const togglePopover = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const dispatch = useAppDispatch();

  return (
    <Popover
      open={open}
      placement="bottomRight"
      trigger="click"
      showArrow={false}
      onOpenChange={togglePopover}
      content={
        <List size="small">
          <List.Item onClick={() => dispatch(logout())} style={{ cursor: "pointer" }}>
            Logout
          </List.Item>
        </List>
      }
      arrow={false}
    >
      <Space
        align="center"
        size={10}
        className={clsx(className, styles.avatar)}
      >
        <UserAvatar
          size={32}
          // style={{margin: 0, padding: 0, lineHeight: 0}}
          userName={username}
          // aria-label={open ? "Hide user menu" : "Show user menu"}
          dataTestId={dataTestId}
        />
        {username}
      </Space>
    </Popover>
  );
};
