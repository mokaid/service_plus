import crypto from "crypto";
import dotenv from "dotenv";
import { API_SECRET_KEY, APP_ID } from "../config/const.js";
import CryptoJS from "crypto-js";

// import stringify from 'safe-stable-stringify';
dotenv.config();

// function simpleStringify(object) {
//     const simpleObject = {};
//     for (const prop in object) {
//         if (!object.hasOwnProperty(prop)) {
//             continue;
//         }
//         if (typeof(object[prop]) == 'object') {
//             continue;
//         }
//         if (typeof(object[prop]) == 'function') {
//             continue;
//         }
//         simpleObject[prop] = object[prop];
//     }
//     return JSON.stringify(simpleObject);
// }

// Function to generate a signature
export function generateSignature({ payload, timestamp }) {
  const stringPayload = JSON.stringify(payload);
  const stringToSign = `${stringPayload}.${APP_ID}.${timestamp}.${API_SECRET_KEY}`;
  const signature = crypto
    .createHash("sha256")
    .update(stringToSign)
    .digest("hex")
    .toLowerCase();
  console.log("STRING PAYLOAD: ", stringPayload);

  console.log("SIGNATURE: ", signature);

  return signature;
}

// Initialize AES key
const aes_key = CryptoJS.enc.Utf8.parse("ssuzv26n57qijno0");

// Generate sign for request
export const getSign = (url, data, timestamp) => {
  const urlParts = url.split("/");
  const lastUri =
    urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
  const bodyData = `${lastUri}.${data}.${timestamp}`;

  const bodyDataResult = CryptoJS.enc.Utf8.parse(bodyData);

  const encrypted = CryptoJS.AES.encrypt(bodyDataResult, aes_key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).ciphertext.toString();

  return CryptoJS.SHA256(encrypted).toString().toLowerCase();
};
