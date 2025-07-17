import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { getLastPathSegment } from "../../utils/helper.js";
import { getUserPostData } from "../../utils/userPostData.js";

export const userRoutes = async (app) => {
  //Get All Users

  app.get("/users", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_ALL_USERS),
        _sender: "",
        org: request?.query.orgId ? [String(request.query.orgId)] : ["0"],
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        ...request?.body,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_ALL_USERS}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      console.log("SESSION USER: ", request.session.get("user"));

      reply.send({ data: response?.data });
    } catch (error) {
      console.error("[ERROR] Users Fetching Failed:");
      console.error(`[RESPONSE] Error: ${error}`);
      throw error;
    }
  });

  // Get All User Permmission List

  app.get("/getAllUsers", async (request, reply) => {
    try {
      const requestData = {
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        msgType: getLastPathSegment(ENDPOINTS.GET_ALL_USERS_PERMISSIONS),
        pageIndex: 1,
        pageSize: 4,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_ALL_USERS_PERMISSIONS}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );

      reply.send({ data: response?.data });
    } catch (error) {
      console.error("[ERROR] Users Fetching Failed:");
      console.error(`[RESPONSE] Error: ${error}`);
      throw error;
    }
  });

  //Get User

  app.get("/user", async (request, reply) => {
    try {
      const requestData = {
        msgType: ENDPOINTS.GET_USER,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_USER}`,
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

  //Post User Allowed Sites

  app.post("/postUserFilter", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.POST_USER_FILTER),
        ...request?.body,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.POST_USER_FILTER}`,
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

  //Delete User

  app.post("/deleteUser", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.DELETE_USER),
        ...request?.body,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.DELETE_USER}`,
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

  //Post User Permission List

  app.post("/postUserPermissionList", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.POST_USER_PERMISSION),
        ...request?.body,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.POST_USER_PERMISSION}`,
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

  //Get User Permission List

  app.get("/getUserPermissionList", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_USER_PERMISSON_LIST),
        ...request?.body,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_USER_PERMISSON_LIST}`,
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

  //Get Single user Permission

  app.post("/getSingleUserPermission", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_SINGLE_USER_PERMISSION),
        ...request?.body,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_SINGLE_USER_PERMISSION}`,
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

  //Get user Allowed Sites

  app.post("/getUserAllowedSites", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.GET_USER_ALLOWED_SITES),
        ...request?.body,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.GET_USER_ALLOWED_SITES}`,
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

  //Post Single User Permission

  app.post("/postSingleUserPermission", async (request, reply) => {
    try {
      const requestData = {
        msgType: getLastPathSegment(ENDPOINTS.POST_SINGLE_USER_PERMISSION),
        ...request?.body,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.POST_SINGLE_USER_PERMISSION}`,
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
