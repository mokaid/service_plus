export const decodeBase64 = <T = Record<string, any>>(
  base64String: string,
): T | null => {
  try {
    if (!base64String) {
      throw new Error("Input base64 string is empty or undefined.");
    }

    const decodedString =
      typeof Buffer !== "undefined"
        ? Buffer.from(base64String, "base64").toString("utf-8") // Node.js
        : atob(base64String); // Browser

    return JSON.parse(decodedString) as T;
  } catch (error: any) {
    // console.error("[ERROR] Failed to decode base64 string:", error?.message);
    return null; // Return `null` to indicate failure explicitly
  }
};
