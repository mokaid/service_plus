import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { getLastPathSegment } from "../../utils/helper.js";
import { sitesFilter } from "../../utils/siteFilter.js";

export const eventsRoutes = async (app) => {
  //Get Events
  app.post("/events", async (request, reply) => {
    var sites_filter = await sitesFilter(request);
    try {
      const requestData = {
        ...(request?.body?.endTime
          ? {
              endTime: request?.body?.endTime,
            }
          : {}),
        msgType: "getevents",
        ...(request?.body?.startTime
          ? {
              startTime: request?.body?.startTime,
            }
          : {}),

        ...(request?.body?.keyword
          ? { keyword: request?.body?.keyword || request?.body?.keyword }
          : { keyword: "" }),

        ...(request?.body?.eventType
          ? { itemKeys: request?.body?.eventType || request?.body?.devices }
          : {}),

        ...(request?.body?.devices ? { objIds: request?.body?.devices } : {}),
        ...(request?.body?.pageIndex
          ? { pageIndex: request?.body?.pageIndex }
          : {}),
        ...(request?.body?.pageSize
          ? { pageSize: request?.body?.pageSize }
          : {}),
        ...(request?.body?.processed || request?.body.processed === 0
          ? { processed: request?.body?.processed }
          : { processed: -1 }),
        ...(sites_filter ? { sites: sites_filter } : {}),
        ...(request?.body?.sites && request?.body?.sites.length > 0
          ? { sites: request?.body?.sites }
          : {}),
        ...(request?.body?.vendors ? { vendors: request?.body?.vendors } : {}),
        ...(request?.body?.priority
          ? { itemLevels: request?.body?.priority }
          : { itemLevels: [0, 1, 2, 3, 4, 5] }),
        orderBy: -1,
      };

      console.log(requestData, "requestData from eventsRoutes");

      const response = await axiosInstance.post(
        `/${ENDPOINTS.QUERY_EVENTS}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      reply.send({ data: response.data });
    } catch (error) {
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      throw error;
    }
  });

  // Update Event Status

  app.post("/processEvent", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.PROCESS_EVENT),
        actionType: "Acknowledge with no Action",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        _sender: "",
        ...request?.body,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.PROCESS_EVENT}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      reply.send({ data: response.data });
    } catch (error) {
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      throw error;
    }
  });

  //Update Single Event Status

  app.post("/postProcessSingleEvent", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.POST_PROCESS_SINGLE),
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        _sender: "",
        ...request?.body,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.POST_PROCESS_SINGLE}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      reply.send({ data: response.data });
    } catch (error) {
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      throw error;
    }
  });

  //Post Quick Recovery

  app.post("/fastRecovery", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.FAST_RECOVERY),
        processed: 99,
        startTime: request?.body?.startTime
          ? request?.body?.startTime
          : new Date(new Date().setMonth(new Date().getMonth() - 1))
              .toISOString()
              .replace("T", " ")
              .substring(0, 23),
        endTime: request?.body?.endTime
          ? request?.body?.endTime
          : new Date().toISOString().replace("T", " ").substring(0, 23),
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        _sender: "",
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.FAST_RECOVERY}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      reply.send({ data: response.data });
    } catch (error) {
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      throw error;
    }
  });
};
