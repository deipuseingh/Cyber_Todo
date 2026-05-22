import { Client, Databases } from "appwrite";

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
};

export const isAppwriteConfigured = Object.values(appwriteConfig).every(Boolean);

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint || "https://cloud.appwrite.io/v1")
  .setProject(appwriteConfig.projectId || "missing-project-id");

export const databases = new Databases(client);
