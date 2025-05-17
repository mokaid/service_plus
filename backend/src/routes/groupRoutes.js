import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { getLastPathSegment } from "../../utils/helper.js";

export const groupRoutes = async (app) => {
  // ADD/MODIFY GROUPS
  app.post("/postGroup", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.POST_GROUP),
        name: request.body?.name,
        ...(request.body?.orgId ? { orgId: request.body?.orgId } : {}),
        ...(request.body?.id ? { id: request.body?.id } : {}),
        ...(request.body?.parentGroupId
          ? { parentGroupId: request.body.parentGroupId }
          : {}),
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.POST_GROUP}`,
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

  app.post("/deleteGroup", async (request, reply) => {
    try {
      const requestData = {
        msgType: ENDPOINTS.DELETE_GROUP,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.DELETE_GROUP}`,
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
