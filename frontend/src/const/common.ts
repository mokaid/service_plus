export const IS_DEVELOPMENT = import.meta.env.DEV;

export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export const API_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss a" as const;

export const APP_DATE_FORMAT = "DD\u00A0MMM\u00A0YYYY" as const;

export const APP_DATE_TIME_FORMAT =
  `${APP_DATE_FORMAT}, h:mm:ss\u00A0A` as const;

export const QUERY_STRING_ARRAY_FORMAT = "comma";

export const DEFAULT_SEARCH_PARAM_NAME = "keyword" as const;
