import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const statisticsEndpoints = (
  builder: EndpointBuilder<any, any, any>,
) => ({
  getDashboardStatistics: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DASHBOARD_STATISTICS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getAssetsStatistics: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.ASSETS_STATISTICS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getChartData: builder.query({
    query: () => ({
      url: ENDPOINTS.GET_CHART_SITE_COUNT,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getChartSiteSystemObjectCount: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_CHART_SITE_SYSTEM_OBJECT_COUNT,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getChartEventsCountOfOfflineHistroy: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_CHART_EVENT_COUNT_OF_OFFLINE_HISTORY,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getChartEventsResponseTime: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_CHART_EVENTS_RESPONSE_TIME,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getChartEventsCountsByStatus: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_CHARTS_EVENTS_COUNT_BY_STATUS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getEventTopData: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_EVENT_TOP_DATA,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
});
