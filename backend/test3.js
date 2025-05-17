const crypto = require("crypto");
const axios = require("axios");

// Server configuration
const serverIp = "20.46.47.229"; // Server 2 IP
const port = "8012";
const appId = "SP_PY";
const appSecret = "eb803d0d5ecf6e2e520092015d458d27b772c282063cf5aad2277082cf91ecc1";

// Function to generate a signature
function generateSignature(payload, appId, timestamp, appSecret) {
  const stringToSign = `${payload}.${appId}.${timestamp}.${appSecret}`;
  return crypto.createHash("sha256").update(stringToSign).digest("hex").toLowerCase();
}

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
  const loginUrl = `http://${serverIp}:${port}/api/UserLogin`;
  const payload = {
    msgType: "userLogin",
    userName: "moka",
    password: "ef219795081eb9c410d8623d3842f8ee",
  };
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sign = generateSignature(JSON.stringify(payload), appId, timestamp, appSecret);

  const queryParams = `?_appid=${appId}&_timestamp=${timestamp}&_sign=${sign}&_plaintext=1`;

  console.log("\n[INFO] Calling UserLogin API...");
  console.log(`[REQUEST] URL: ${loginUrl + queryParams}`);
  console.log(`[REQUEST] Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(loginUrl + queryParams, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("[SUCCESS] UserLogin API Response:");
    console.log(`[RESPONSE] Data: ${JSON.stringify(response.data, null, 2)}`);
    return response.data.token;
  } catch (error) {
    console.error("[ERROR] UserLogin API Failed:");
    console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
    throw error;
  }
}

// Function to call getUser API
async function getUserData(token) {
  const getUserUrl = `http://${serverIp}:${port}/api/getUser`;
  const payload = {
    msgType: "getuser",
    token: token,
  };

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sign = generateSignature(JSON.stringify(payload), appId, timestamp, appSecret);

  const queryParams = `?_appid=${appId}&_timestamp=${timestamp}&_sign=${sign}&_plaintext=1`;

  console.log("\n[INFO] Calling getUser API...");
  console.log(`[REQUEST] URL: ${getUserUrl + queryParams}`);
  console.log(`[REQUEST] Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(getUserUrl + queryParams, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-ps-token": `PS-API-TOKEN ${token}`,
      },
    });

    console.log("[SUCCESS] getUser API Response:");
    const userData = response.data.user;

    // Decode and display permissions if present
    if (userData.permission) {
      console.log("\n[INFO] Decoding User Permissions...");
      const decodedPermissions = decodeBase64(userData.permission);
      userData.decodedPermissions = decodedPermissions; // Attach decoded permissions to userData
      console.log("[DECODED PERMISSIONS]:", JSON.stringify(decodedPermissions, null, 2));
    } else {
      console.log("[INFO] No permissions found for the user.");
    }

    console.log(`[RESPONSE] User Data: ${JSON.stringify(userData, null, 2)}`);
    return userData;
  } catch (error) {
    console.error("[ERROR] getUser API Failed:");
    console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
    throw error;
  }
}

// Function to query events
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

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sign = generateSignature(JSON.stringify(payload), appId, timestamp, appSecret);

  const queryParams = `?_appid=${appId}&_timestamp=${timestamp}&_sign=${sign}&_plaintext=1`;

  console.log("\n[INFO] Calling queryEvents API...");
  console.log(`[REQUEST] URL: ${queryEventsUrl + queryParams}`);
  console.log(`[REQUEST] Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(queryEventsUrl + queryParams, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-ps-token": `PS-API-TOKEN ${token}`,
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
