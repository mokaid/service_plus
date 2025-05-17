import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const userEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  getUsers: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.USERS_LIST,
      params,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getAllUsers: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.GET_ALL_USERS,
      params,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getUser: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.GET_USER,
      params,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  postUserFilter: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.POST_USER_FILTER,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  deleteUser: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DELETE_USER,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  registerUser: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.REGISTER_USER,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  postUserPermissionList: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.POST_USER_PERMISSSION,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  postSingleUserPermission: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.POST_SINGLE_USER_PERMISSION,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getUserPermissionList: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.GET_USER_PERMISSSION_LIST,
      params,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getSingleUserPermission: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_SINGLE_USER_PERMISSION,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),

  getUserAllowedSites: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_USER_ALLOWED_SITES,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
});
