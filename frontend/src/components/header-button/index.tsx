import type { FC } from "react";
import { Button, type ButtonProps, ConfigProvider, Tooltip } from "antd";

type Props = Omit<ButtonProps, "type" | "size"> & {
  label?: string;
  dataTestId?: string;
};

export const HeaderButton: FC<Props> = ({ label, dataTestId, ...props }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          onlyIconSizeLG: 20,
        },
      },
    }}
  >
    <Tooltip title={label}>
      <Button
        type="text"
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        data-testid={dataTestId}
        aria-label={label}
        {...props}
      />
    </Tooltip>
  </ConfigProvider>
);
