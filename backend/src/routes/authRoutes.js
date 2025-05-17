import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { hashPassword } from "../../utils/hashPassword.js";

export const authRoutes = async (app) => {
  app.post("/login", async (request, reply) => {
    try {
      const hashedPass = await hashPassword(request?.body?.password);

      // Prepare the request body
      const requestBody = {
        userName: request?.body?.userName,
        password: hashedPass || "",
        vefcode_img: request?.body?.vefcode_img || "",
        msgType: "userlogin",
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        loginApp: "sp",
        loginEnd: "pc",
      };

      // Make the API request with plain JSON body
      const response = await axiosInstance.post(
        `/${ENDPOINTS.LOGIN}`,
        requestBody,
        {
          headers: {
            ...request?.headers,
          },
        }
      );

      if (!response.data.error && response?.data?.token) {
        const token = response.data.token;

        try {
          const getUserBody = {
            loginApp: "sp",
            loginEnd: "mobile",
            token: token,
            msgType: "getuserbytoken",
            _sender: "",
            _sendTime: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 23),
          };

          // GET USER
          const user = await axiosInstance.post(
            `/${ENDPOINTS.GET_USER}`,
            getUserBody,
            {
              headers: {
                Authorization: token,
              },
            }
          );

          if (user && !user.data.error) {
            request.session.set("user", user.data.user);
            console.log(
              "SESSION USER after login:",
              request.session.get("user")
            );

            reply.send({
              data: {
                ...response.data,
                user: user.data.user,
              },
            });
          } else {
            reply.send({
              data: {
                error: 1021,
              },
            });
          }
        } catch (err) {
          reply.send({
            data: {
              error: 1020,
            },
          });
        }
      } else {
        reply.send({
          data: {
            error: 1000,
            desc: response.data.desc || "Login failed",
          },
        });
      }
    } catch (error) {
      console.error("[ERROR] Login Failed: ", error);
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      reply.send({
        data: {
          error: 1000,
          desc: error.response?.data?.desc || "An error occurred during login",
        },
      });
    }
  });

  app.post("/refreshToken", async (request, reply) => {
    try {
      const requestData = {
        msgType: ENDPOINTS.REFRESH_TOKEN,
      };
      const response = await axiosInstance.post(
        `/${ENDPOINTS.LOGIN}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      reply.send({ data: response.data });
    } catch (error) {
      console.error("[ERROR] Refresh Token Failed:");
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      throw error;
    }
  });

  app.post("/PostUser", async (request, reply) => {
    try {
      const requestData = {
        msgType: "postuser",
        _sender: "",
        _sendTime: new Date().toISOString().replace("T", " ").substring(0, 23),
        ...request.body,
      };

      const response = await axiosInstance.post(
        `/${ENDPOINTS.REGISTER_USER}`,
        requestData,
        {
          headers: {
            ...request?.headers,
          },
        }
      );

      reply.send({ data: response.data });
    } catch (error) {
      console.error("[ERROR] User Registration Failed:");
      console.error(
        `[RESPONSE] Error: ${error.response?.data || error.message}`
      );
      throw error;
    }
  });
};
