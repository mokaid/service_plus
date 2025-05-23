import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "query-string";

import { ENDPOINTS } from "@/const/endpoints";
import {
  authEndpoints,
  groupEndpoints,
  orgEndpoints,
  statisticsEndpoints,
  systemsEndpoints,
  uploadEndpoints,
  userEndpoints,
} from "@/services/endpoints";
import { logout, setUserCredentials } from "@/store/slices/authSlice";
import { ReqQueryBySite } from "@/types/device-event";
import { RootState } from "@/types/store";
import { API_BASE_URL, QUERY_STRING_ARRAY_FORMAT } from "../const/common";
import { eventsEndpoints } from "./endpoints/eventsEndpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.authState.token;
    if (token) {
      headers.set("Authorization", token);
    }
    return headers;
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: QUERY_STRING_ARRAY_FORMAT,
      skipEmptyString: true,
      skipNull: true,
    }),
});

const baseQueryWithRefreshToken = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized responses
  if (result?.error?.status === 401) {
    api.dispatch(logout());
    return result;
  }

  if (result?.error && result?.error?.status === "FETCH_ERROR") {
    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      {
        url: ENDPOINTS.REFRESH_TOKEN,
        method: "POST",
        body: { token: (api.getState() as RootState).authState.token },
      },
      api,
      extraOptions,
    );

    if (
      refreshResult?.data &&
      typeof refreshResult.data === "object" &&
      "error" in refreshResult.data &&
      refreshResult.data.error === 0
    ) {
      const newToken = (refreshResult.data as unknown as { token: string })
        .token;
      api.dispatch(setUserCredentials({ token: newToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    ...authEndpoints(builder),
    ...userEndpoints(builder),
    ...orgEndpoints(builder),
    ...groupEndpoints(builder),
    ...eventsEndpoints(builder),
    ...statisticsEndpoints(builder),
    ...uploadEndpoints(builder),
    ...systemsEndpoints(builder),
    queryeventsite: builder.mutation({
      query: (body: ReqQueryBySite) => ({
        url: "query-events-countby-by-site",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }, meta, arg) => response.data,
    }),
  }),
});

export const {
  // AUTH
  useLoginMutation,
  useRefreshTokenMutation,
  useRegisterUserMutation,

  // USERS
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  usePostUserPermissionListMutation,
  useGetUserPermissionListQuery,
  useGetSingleUserPermissionMutation,
  useGetUserAllowedSitesMutation,
  usePostUserFilterMutation,
  usePostSingleUserPermissionMutation,

  // ORGANIZAIONS
  useGetOrganizationsMutation,
  usePostOrganizationMutation,

  // GROUPS
  usePostGroupMutation,
  useDeleteGroupMutation,

  // SITES
  useGetSitesQuery,
  useCreateSiteMutation,
  useDeleteSiteMutation,
  useRestartBoxMutation,
  useUpdateIoEventsMutation,
  useGetMaskedItemMutation,
  useGetBoxStatusMutation,
  useGetIoEventsMutation,
  useUpgradeBoxMutation,
  useDeleteMaskedItemMutation,

  // UPLOAD
  useUploadMutation,
  useGetUploadsQuery,
  useDeleteUploadMutation,

  // STATISTICS
  useGetDashboardStatisticsMutation,
  useGetAssetsStatisticsMutation,
  useGetChartDataQuery,
  useGetChartSiteSystemObjectCountMutation,
  useGetChartEventsCountOfOfflineHistroyMutation,
  useGetChartEventsResponseTimeMutation,
  useGetChartEventsCountsByStatusMutation,
  useGetEventTopDataMutation,
  useGetBoxPropertyMutation,
  usePostOrgContactsMutation,

  // EVENTS
  useQueryEventsMutation,
  useProcessEventMutation,

  // OTHERS
  useQueryeventsiteMutation,
  useGetFastRecoveryMutation,
  useMaskItemMutation,
  useConfigureBoxMutation,
  useEventsFiltersMutation,

  //SYSTEMS
  useGetSiteSystemsMutation,
  useGetSiteSystemObjectMutation,
  useGetSiteSystemObjectItemMutation,
  usePostProcessSingleEventMutation,
} = api;
