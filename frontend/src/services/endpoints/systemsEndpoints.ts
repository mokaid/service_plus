import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const systemsEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  getSiteSystems: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_SITE_SYSTEMS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getSiteSystemObject: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_SITE_SYSTEM_OBJECT,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getSiteSystemObjectItem: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_SITE_SYSTEM_OBJECT_ITEM,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
});
