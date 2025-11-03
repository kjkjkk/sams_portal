import { Account, Client, Databases } from "appwrite";

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID || "",
  collections: {
    users2: process.env.EXPO_PUBLIC_APPWRITE_COL_USERS2_ID || "", // For login
    dtrSamsCard: process.env.EXPO_PUBLIC_APPWRITE_COL_DTR_SAMS_CARD_ID || "", // For DTR logs
    schoolaccounts:
      process.env.EXPO_PUBLIC_APPWRITE_COL_SCHOOLACCOUNTS_ID || "", // For school names
  },
};

// Debug: Log config to check if env vars are loading
console.log("[v0] Appwrite Config loaded:", {
  endpoint: !!config.endpoint,
  projectId: !!config.projectId,
  databaseId: !!config.databaseId,
});

// Validate required config
if (!config.endpoint || !config.projectId || !config.databaseId) {
  console.error("[v0] ❌ Missing Appwrite credentials! Check your env vars");
}

const collectionIds = {
  users2: config.collections.users2,
  dtrSamsCard: config.collections.dtrSamsCard,
  schoolaccounts: config.collections.schoolaccounts,
};

const missingCollections = Object.entries(collectionIds)
  .filter(([_, id]) => !id)
  .map(([name]) => name);

if (missingCollections.length > 0) {
  console.error(
    "[v0] ❌ Missing Collection IDs:",
    missingCollections,
    "\nPlease add these to your environment variables:",
    missingCollections
      .map((name) => {
        if (name === "users2") return "EXPO_PUBLIC_APPWRITE_COL_USERS2_ID";
        if (name === "dtrSamsCard")
          return "EXPO_PUBLIC_APPWRITE_COL_DTR_SAMS_CARD_ID";
        if (name === "schoolaccounts")
          return "EXPO_PUBLIC_APPWRITE_COL_SCHOOLACCOUNTS_ID";
      })
      .join(", ")
  );
}

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const database = new Databases(client);
const account = new Account(client);

export { account, client, config, database };
