import axios from "axios";
import dotenv from "dotenv";
import { generateSignature, getSign } from "../utils/generateSign.js";
import { APP_ID } from "./const.js";
dotenv.config();

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: process.env.API_URL, // Replace with your API base URL
  timeout: 20000, // Timeout in milliseconds
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // const timestamp = Math.floor(Date.now() / 1000).toString();
    // const signature = generateSignature({
    //   payload: config?.data || {},
    //   timestamp: timestamp,
    // });

    const bodyString = JSON.stringify(config?.data);
    const timestamp = String(new Date().getTime());
    const signature = getSign(config?.url, bodyString, timestamp);

    const token =
      config.headers?.Authorization || config.headers?.authorization || false;

    config.params = {
      ...config.params,
      timestamp: timestamp,
      sign: signature,
    };

    config.headers = {
      // ...config.headers,
      ...(token ? { "x-ps-token": `ps-api-token ${token}` } : {}),
      "x-ps-timezoneoffset": new Date().getTimezoneOffset().toString(),
      "Content-Type": "application/json",
    };

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // If the error has a response, reject with the response
      //log data.data
      console.log("AX ERROR: ", error);
      console.log("AX ERROR: ", error?.response.data);
      return Promise.reject(error.response);
    } else if (error.request) {
      // If no response was received but the request was made
      console.log("No response received:", error.request);
      return Promise.reject({
        message: "No response received from the server",
        request: error.request,
      });
    } else {
      // Something else caused the error (e.g., setup issues)
      console.log("Error during setup:", error.message);
      return Promise.reject({
        message: "An error occurred during the request setup",
        error: error.message,
      });
    }
  }
);

export default axiosInstance;
