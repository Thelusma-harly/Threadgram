import {
  Client,
  Databases,
  Account,
  Storage,
  Avatars,
  TablesDB,
} from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_ENDPOINT,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userTableId: import.meta.env.VITE_APPWRITE_USER_TABLE_ID,
  postTableId: import.meta.env.VITE_APPWRITE_POST_TABLE_ID,
  savesTableId: import.meta.env.VITE_APPWRITE_SAVES_TABLE_ID,
  followsTableId: import.meta.env.VITE_APPWRITE_FOLLOWS_TABLE_ID,
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url).setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
