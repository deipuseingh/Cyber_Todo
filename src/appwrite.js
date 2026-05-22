import { Client, Databases } from "appwrite";

const fallbackConfig = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  projectId: "6a10b0410009601f103b",
  databaseId: "6a10b21d002b6b8780dd",
  collectionId: "list",
};

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || fallbackConfig.endpoint,
  projectId:
    import.meta.env.VITE_APPWRITE_PROJECT_ID || fallbackConfig.projectId,
  databaseId:
    import.meta.env.VITE_APPWRITE_DATABASE_ID || fallbackConfig.databaseId,
  collectionId:
    import.meta.env.VITE_APPWRITE_COLLECTION_ID || fallbackConfig.collectionId,
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
