import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const uploadEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  upload: builder.mutation({
    query: (body: FormData) => ({
      url: ENDPOINTS.UPLOAD,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  getUploads: builder.query({
    query: () => ({
      url: ENDPOINTS.GET_UPLOADS,
    }),
    transformResponse: (response: { data: any }) => response.data,
  }),
  deleteUpload: builder.mutation({
    query: (id: number) => ({
      url: `${ENDPOINTS.UPLOAD}/${id}`, // Assuming DELETE_UPLOAD points to "/upload"
      method: "DELETE",
    }),
    transformResponse: (response: { data: any }) => response,
  }),
});
