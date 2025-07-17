import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";

import { getLastPathSegment } from "../../utils/helper.js";
import { sitesFilter } from "../../utils/siteFilter.js";

export const statisticsRoutes = async (app) => {
  //Get Chart Data

  app.get("/getChartData", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_CHART_DATA),
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_CHART_DATA}`,
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

  //Get Site System Object/Device Count

  app.post("/getChartSiteSystemObjectCount", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(
          ENDPOINTS.GET_CHART_SITE_SYSTEM_OBJECT_COUNT
        ),
        ...request.body,
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_CHART_SITE_SYSTEM_OBJECT_COUNT}`,
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

  //Get Chart Events offline History

  app.post("/getChartEventsCountOfOfflineHistroy", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(
          ENDPOINTS.GET_CHART_EVENTS_COUNT_OFFLINE_HISTORY
        ),
        ...request.body,
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_CHART_EVENTS_COUNT_OFFLINE_HISTORY}`,
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

  //Get Events Response Time

  app.post("/getEventsResponseTime", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_CHART_EVENTS_RESPONSE_TIME),
        ...request.body,
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_CHART_EVENTS_RESPONSE_TIME}`,
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

  //Get Events Count by Status

  app.post("/getEventsCountbyStatus", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_CHART_EVENTS_COUNT_BY_STATUS),
        ...request.body,
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_CHART_EVENTS_COUNT_BY_STATUS}`,
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

  //Get Event Top Data
  app.post("/getEventDataTop", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_EVENT_TOP_DATA),
        ...request.body,
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_EVENT_TOP_DATA}`,
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

  // Query events
  app.post("/getFilters", async (request, reply) => {
    var sites_filter = await sitesFilter(request);

    const requestData = {
      msgType: "QueryEvents",
      ...(sites_filter ? { sites: sites_filter } : {}),
    };
    const allAlerts = await axiosInstance.post(
      `/${ENDPOINTS.QUERY_EVENTS}`,
      requestData,
      {
        headers: {
          ...request?.headers,
        },
      }
    );

    if (allAlerts.data?.error == 0) {
      const alerts = allAlerts.data.data.event || [];
      const vendors = [];
      const devices = [];
      const eventTypes = [];

      alerts.map((alert) => {
        if (!devices.includes(alert.obj.name)) {
          devices.push(alert.obj.name);
        }
        if (!vendors.includes(alert.vendor)) {
          vendors.push(alert.vendor);
        }
        if (!eventTypes.includes(alert.obj.key)) {
          eventTypes.push(alert.obj.key);
        }
      });

      reply.send({
        data: {
          vendors,
          devices,
          eventTypes,
        },
      });
    }

    reply.send({ data: [] });
  });
};
