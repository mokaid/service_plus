import {
  Children,
  cloneElement,
  CSSProperties,
  type FC,
  isValidElement,
  type PropsWithChildren,
} from "react";
import { theme } from "antd";
import clsx from "clsx";

import { ActionListItem } from "./action-list-item";

import styles from "./index.module.css";

type ActionListCompoundComponent = FC<ActionListProps> & {
  Item: typeof ActionListItem;
};

export type ActionListProps = PropsWithChildren<{
  className?: string;
  dataTestId?: string;
}>;

const ActionList: ActionListCompoundComponent = ({
  className,
  children,
  dataTestId,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const themeStyles: CSSProperties = {
    backgroundColor: colorBgContainer,
  };

  return (
    <ul
      className={clsx(className, styles.container)}
      style={themeStyles}
      data-testid={dataTestId}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child) : null,
      )}
    </ul>
  );
};

ActionList.Item = ActionListItem;

export { ActionList };
