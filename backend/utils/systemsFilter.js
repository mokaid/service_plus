import axiosInstance from "../config/axios.js";
import { ENDPOINTS } from "../config/endpoints.js";
import { decodeBase64 } from "./base64.js";

export async function systemsFilter(request) {
  var filters = [];
  var systems = [];

  if (request.session.user) {
    const user_filter = request.session?.user?.filter;
    if (user_filter) {
      filters = decodeBase64(user_filter);
    }
  } else if (request.headers?.authorization || request.headers?.Authorization) {
    const token =
      request.headers?.authorization || request.headers?.Authorization;
    const user = await axiosInstance.post(
      `/${ENDPOINTS.GET_USER}`,
      {
        msgType: ENDPOINTS.GET_USER,
        token: token,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (user.data?.error == 0) {
      const filter = user.data.user.filter;
      if (filter) {
        filters = decodeBase64(filter);
      }
    }
  }

  if (filters) {
    if (filters.systems && filters.systems.length > 0) {
      systems = filters.systems;
    } else if (filters.systems) {
      var reqBody = {
        msgType: ENDPOINTS.GET_SYSTEMS,
      };

      const orgs = await axiosInstance.post(
        `/${ENDPOINTS.GET_SYSTEMS}`,
        reqBody,
        {
          headers: {
            ...request?.headers,
          },
        }
      );
      if (orgs?.data && orgs.data?.error == 0) {
        const filtered_org = orgs.data.orgs.filter(
          (org) => org.id == filters.systems
        );
        if (filtered_org.length > 0 && filtered_org[0].sites.length > 0) {
          sites = filtered_org[0].sites.map((site) => site.id);
        }
      }
    }
  }

  console.log("SYSTEMSsss FILTERSSSSS123: ", systems);

  return systems;
}
