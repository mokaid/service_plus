import { useMemo } from "react";
import { Select, type SelectProps, Spin } from "antd";

import styles from "./index.module.css";

export type BaseSelectProps<T = unknown> = Omit<
  SelectProps<T>,
  "showArrow" | "showSearch"
> & {
  validating?: boolean;
  dataTestId?: string;
};

export function BaseSelect<T = unknown>({
  disabled,
  value,
  notFoundContent,
  dataTestId,
  loading = false,
  options = [],
  validating = false,
  optionFilterProp = "label",
  className,
  ...props
}: BaseSelectProps<T>) {
  const showValue = useMemo(() => {
    if (loading) {
      return false;
    }

    // TODO: Check array
    if (Array.isArray(value)) {
      return true;
    }

    return options.some((option) => option.value === value);
  }, [loading, options, value]);

  return (
    <Select<T>
      options={options}
      loading={loading || validating}
      disabled={loading || disabled}
      optionFilterProp={optionFilterProp}
      value={showValue ? value : undefined}
      showSearch={true}
      className={className}
      notFoundContent={
        loading ? (
          <Spin className={styles.loaderContainer} size="small" />
        ) : (
          notFoundContent
        )
      }
      data-testid={dataTestId}
      {...props}
    />
  );
}
