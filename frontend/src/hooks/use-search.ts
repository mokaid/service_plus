import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import qs from "query-string";

import { DEFAULT_SEARCH_PARAM_NAME } from "../const/common";

export function useSearch(
  searchParamName: string = DEFAULT_SEARCH_PARAM_NAME,
  resetPagination = true,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(searchParamName) || undefined;

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const newSearchParams: Record<string, unknown> = {
        ...Object.fromEntries(searchParams),
        [searchParamName]: searchTerm.replace(/\s+/, " ").trim(),
      };

      if (resetPagination && searchParams.get("offset") !== null) {
        newSearchParams.offset = 0;
      }

      setSearchParams(
        qs.stringify(newSearchParams, { skipEmptyString: true }),
        {
          replace: true,
        },
      );
    },
    [resetPagination, searchParamName, searchParams, setSearchParams],
  );

  const handleClear = useCallback(() => {
    const { [searchParamName]: q, ...newSearchParams } =
      Object.fromEntries(searchParams);

    setSearchParams(newSearchParams, { replace: true });
  }, [searchParamName, searchParams, setSearchParams]);

  return {
    initialValue,
    onSearch: handleSearch,
    onClear: handleClear,
  };
}
