import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { getLastPathSegment } from "../../utils/helper.js";
import { getUserPostData } from "../../utils/userPostData.js";

export const userRoutes = async (app) => {
  app.get("/users", async (request, reply) => {
    // console.log(request?.param, "request");

    try {
      const requestData = {
        msgType: "getuserlist",
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

  app.get("/getAllUsers", async (request, reply) => {
    try {
      const requestData = {
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        msgType: "GetUserPermissionList",
        pageIndex: 1,
        pageSize: 4,
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

      reply.send({ data: response?.data });
    } catch (error) {
      console.error("[ERROR] Users Fetching Failed:");
      console.error(`[RESPONSE] Error: ${error}`);
      throw error;
    }
  });

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

  app.post("/postUserFilter", async (request, reply) => {
    try {
      // const userData = await getUserPostData(request?.body);
      const requestData = {
        msgType: "postuserfilter",
        ...request?.body,
        // ...userData,
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

  app.post("/deleteUser", async (request, reply) => {
    try {
      const requestData = {
        msgType: "deleteUser",
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

  app.post("/postUserPermissionList", async (request, reply) => {
    try {
      const requestData = {
        msgType: "postuserpermission",
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

  app.get("/getUserPermissionList", async (request, reply) => {
    try {
      const requestData = {
        msgType: "getuserpermissionlist",
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

  app.post("/getSingleUserPermission", async (request, reply) => {
    try {
      const requestData = {
        msgType: "getuserpermission",
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

  app.post("/getUserAllowedSites", async (request, reply) => {
    try {
      const requestData = {
        msgType: "getuserfilter",
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

  app.post("/postSingleUserPermission", async (request, reply) => {
    try {
      const requestData = {
        msgType: "postuserpermission",
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
