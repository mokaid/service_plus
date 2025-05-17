import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const orgEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  getOrganizations: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_ORGANIZATIONS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  postOrganization: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.POST_ORGANIZATION,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  createSite: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.CREATE_SITE,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getSites: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.GET_SITES,
      params,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  deleteSite: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DELETE_SITE,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  restartBox: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.RESTART_BOX,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  updateIoEvents: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.UPDATE_IO_EVENTS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getBoxStatus: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_BOX_STATUS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getIoEvents: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_IO_EVENTS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getMaskedItem: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_MASKED_ITEM,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  maskItem: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.MASK_ITEM,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  upgradeBox: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.UPGRADE_BOX,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  configureBox: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.CONFIGURE_BOX,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  deleteMaskedItem: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DELETE_MASKED_ITEM,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getFastRecovery: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.FAST_RECOVERY,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
});
