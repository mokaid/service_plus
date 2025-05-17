import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const authEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  login: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.LOGIN,
      method: "POST",
      body,
    }),
    invalidatesTags: ["auth"],
    transformResponse: (response: { data: any }) => response.data,
  }),
  refreshToken: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.REFRESH_TOKEN,
      method: "POST",
      body,
    }),
    invalidatesTags: ["authRefresh"],
    transformResponse: (response: { data: any }) => response.data,
  }),
});
