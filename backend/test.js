import crypto from "crypto";
import axios from "axios";

// Server configuration
const serverIp = "20.46.47.229"; // Server 2 IP
const port = "38088";

// Function to decode Base64 permissions
function decodeBase64(base64String) {
  try {
    const buffer = Buffer.from(base64String, "base64");
    return JSON.parse(buffer.toString("utf-8"));
  } catch (error) {
    console.error("[ERROR] Failed to decode permissions:", error.message);
    return {};
  }
}

// Function to get the token
async function getToken() {
  const loginUrl = `http://${serverIp}:${port}/Access/userLogin`;
  const payload = {
    msgType: "userLogin",
    userName: "moka",
    password: "ef219795081eb9c410d8623d3842f8ee", // MD5 hash
    loginApp: "sp"
  };

  console.log("\n[INFO] Calling UserLogin API...");
  console.log(`[REQUEST] URL: ${loginUrl}`);
  console.log(`[REQUEST] Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(loginUrl, payload, {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

    console.log("[SUCCESS] UserLogin API Response:");
    console.log(`[RESPONSE] Data: ${JSON.stringify(response.data, null, 2)}`);
    const token = response.data.token;

    if (!token) {
      throw new Error("Token not returned by server");
    }

    return token;
  } catch (error) {
    console.error("[ERROR] UserLogin API Failed:");
    console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
    throw error;
  }
}

// Function to call getUserByToken API
async function getUserData(token) {
  const getUserUrl = `http://${serverIp}:${port}/Access/getUserByToken`;
  const payload = {
    msgType: "getUserByToken",
    token: token,
    loginApp: "sp"
  };

  console.log("\n[INFO] Calling getUserByToken API...");
  console.log(`[REQUEST] URL: ${getUserUrl}`);
  console.log(`[REQUEST] Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(getUserUrl, payload, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ps-token": `ps-api-token ${token}`
      },
    });

    console.log("[SUCCESS] getUserByToken API Response:");
    const userData = response.data.user;

    if (userData?.permission) {
      console.log("\n[INFO] Decoding User Permissions...");
      const decodedPermissions = decodeBase64(userData.permission);
      userData.decodedPermissions = decodedPermissions;
      console.log("[DECODED PERMISSIONS]:", JSON.stringify(decodedPermissions, null, 2));
    } else {
      console.log("[INFO] No permissions found for the user.");
    }

    console.log(`[RESPONSE] User Data: ${JSON.stringify(userData, null, 2)}`);
    return userData;
  } catch (error) {
    console.error("[ERROR] getUserByToken API Failed:");
    console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
    throw error;
  }
}

// Function to query events (still using old API path until confirmed)
async function queryEvents(token) {
  const queryEventsUrl = `http://${serverIp}:${port}/api/queryEvents`;
  const payload = {
    startTime: "2024-11-19 00:00:00",
    endTime: "2024-12-20 23:59:59",
    pageIndex: 1,
    pageSize: 50,
    sites: [],
    keyword: "",
    msgType: "queryevents",
  };

  console.log("\n[INFO] Calling queryEvents API...");
  console.log(`[REQUEST] URL: ${queryEventsUrl}`);
  console.log(`[REQUEST] Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(queryEventsUrl, payload, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ps-token": `ps-api-token ${token}`,
      },
    });
    console.log("[SUCCESS] queryEvents API Response:");
    console.log(`[RESPONSE] Data: ${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    console.error("[ERROR] queryEvents API Failed:");
    console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
  }
}

// Main function to run the process
(async () => {
  try {
    console.log("===== STARTING API CALLS =====");
    const token = await getToken();
    console.log(`[INFO] Token Fetched Successfully: ${token}`);

    const userData = await getUserData(token);
    console.log("[INFO] User Data Fetched:");
    console.log(JSON.stringify(userData, null, 2));

    await queryEvents(token);
    console.log("===== API CALLS COMPLETED SUCCESSFULLY =====");
  } catch (error) {
    console.error("[ERROR] Process Failed:", error.message);
  }
})();