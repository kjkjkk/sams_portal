export const mysqlConfig = {
  host: process.env.EXPO_PUBLIC_API_HOST || "localhost",
  port: process.env.EXPO_PUBLIC_API_PORT || 3000,
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.248:3000",
};

export const getApiUrl = (endpoint) => {
  return `${mysqlConfig.baseURL}${endpoint}`;
};
