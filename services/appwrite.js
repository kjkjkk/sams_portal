import { Platform } from "react-native";
import { Account, Client, Databases } from "react-native-appwrite";

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
  collections: {
    notes: process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID,
    users: process.env.EXPO_PUBLIC_APPWRITE_COL_USERS_ID,
  },
};

// Debug: Log config to check if env vars are loading
console.log("Appwrite Config:", {
  endpoint: config.endpoint,
  projectId: config.projectId,
  databaseId: config.databaseId,
  hasUsers: !!config.collections.users,
});

// Validate required config
if (!config.endpoint || !config.projectId) {
  console.error("❌ Missing Appwrite credentials! Check your .env file");
}

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// Platform-specific configuration
if (Platform.OS === "ios") {
  client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID);
} else if (Platform.OS === "android") {
  client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME);
}

const database = new Databases(client);
const account = new Account(client);

export { account, client, config, database };
