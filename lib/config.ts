export const BACKEND_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_GATEWAY_TOKEN = process.env.API_GATEWAY_TOKEN || "66e60f50-d3ff-474b-8507-831345f40ad5"
