import "react-native-url-polyfill/auto";

import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.barakahomes.app",
  endpoint:
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userProfilesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
  payHeroFunctionId:
    process.env.EXPO_PUBLIC_APPWRITE_PAYHERO_FUNCTION_ID ?? "payhero-payments",
};

export const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setPlatform(config.platform!);

if (config.projectId) {
  client.setProject(config.projectId);
}

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const USER_ROLES = ["tenant", "agent", "owner"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type AppUser = {
  $id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

const withTimeout = async <T>(request: Promise<T>, timeoutMs = 12_000) => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Appwrite request timed out. Check your connection and try again.")),
          timeoutMs
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const getErrorDetails = (error: unknown) =>
  typeof error === "object" && error
    ? (error as { code?: number; type?: string; message?: string })
    : {};

export const getAuthenticationErrorMessage = (error: unknown) => {
  const { code, type, message } = getErrorDetails(error);

  if (code === 401 || type?.includes("invalid_credentials"))
    return "Incorrect email or password.";
  if (code === 429)
    return "Too many sign-in attempts. Please wait a moment and try again.";
  if (message?.toLowerCase().includes("timed out")) return message;
  if (message?.toLowerCase().includes("network"))
    return "Unable to reach Appwrite. Check your internet connection and try again.";

  return message || "Authentication could not be completed. Please try again.";
};

const logAuthenticationFailure = (method: string, error: unknown) => {
  const { code, type, message } = getErrorDetails(error);
  const expectedRejection =
    code === 401 ||
    code === 429 ||
    type?.includes("invalid_credentials") ||
    message?.toLowerCase().includes("cancelled");

  if (expectedRejection) {
    console.warn(`[Auth] ${method}: ${getAuthenticationErrorMessage(error)}`);
    return;
  }

  console.error(`[Auth] Unexpected ${method} error:`, error);
};

const clearCurrentSession = async () => {
  try {
    await withTimeout(account.deleteSession("current"));
    console.log("[Auth] Previous session cleared before switching sign-in method");
  } catch (error) {
    const { code } = getErrorDetails(error);
    if (code !== 401) throw error;
  }
};

const getUserRole = (
  labels?: string[],
  provider?: unknown
): UserRole => {
  if (provider === "google") return "tenant";

  const role = labels?.find((label) => USER_ROLES.includes(label as UserRole));
  return role ? (role as UserRole) : "tenant";
};

const toAppUser = (user: {
  $id: string;
  name: string;
  email: string;
  labels?: string[];
  prefs?: Record<string, unknown>;
}): AppUser => {
  const savedAvatar = user.prefs?.avatar;

  return {
    $id: user.$id,
    name: user.name,
    email: user.email,
    avatar:
      typeof savedAvatar === "string" && /^https?:\/\//.test(savedAvatar)
        ? savedAvatar
        : "",
    role: getUserRole(user.labels, user.prefs?.provider),
  };
};

const syncUserProfile = async (user: AppUser, provider: "google" | "email") => {
  // Google users are always saved in Appwrite Auth. This optional document
  // mirrors the profile into a Database collection when one is configured.
  if (!config.databaseId || !config.userProfilesCollectionId) return false;

  const profile: {
    name: string;
    email: string;
    provider: "google" | "email";
    avatar?: string;
  } = {
    name: user.name,
    email: user.email,
    provider,
  };
  if (/^https?:\/\//.test(user.avatar)) profile.avatar = user.avatar;

  try {
    await databases.updateDocument(
      config.databaseId,
      config.userProfilesCollectionId,
      user.$id,
      profile
    );
  } catch {
    await databases.createDocument(
      config.databaseId,
      config.userProfilesCollectionId,
      user.$id,
      profile
    );
  }

  return true;
};

const finishAuthenticatedUser = async (provider: "google" | "email") => {
  const accountUser = await withTimeout(account.get());
  // Social sign-in is the client entry point. Privileged Agent and Owner
  // roles are only honored for the seeded email/password accounts.
  const user = toAppUser({
    ...accountUser,
    prefs: { ...accountUser.prefs, provider },
  });
  const prefs: Record<string, unknown> = {
    ...(accountUser.prefs as Record<string, unknown>),
    provider,
  };
  if (user.avatar) prefs.avatar = user.avatar;
  else delete prefs.avatar;

  await withTimeout(account.updatePrefs({ prefs }));

  try {
    const profileSaved = await syncUserProfile(user, provider);
    console.log(
      profileSaved
        ? "[Auth] User profile saved to the Appwrite database"
        : "[Auth] User saved in Appwrite Auth; profile collection is not configured"
    );
  } catch (error) {
    console.warn("[Auth] User profile database sync skipped:", error);
  }

  return user;
};

export type AvatarUpload = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

export async function updateUserAvatar(file: AvatarUpload): Promise<AppUser> {
  if (!config.bucketId)
    throw new Error("The Appwrite image bucket is not configured.");

  const accountUser = await withTimeout(account.get());
  const previousFileId =
    typeof accountUser.prefs?.avatarFileId === "string"
      ? accountUser.prefs.avatarFileId
      : null;

  const uploadedFile = await withTimeout(
    storage.createFile({
      bucketId: config.bucketId,
      fileId: ID.unique(),
      file,
    }),
    60_000
  );

  const avatarUrl = storage
    .getFileViewURL(config.bucketId, uploadedFile.$id)
    .toString();
  const prefs = {
    ...accountUser.prefs,
    avatar: avatarUrl,
    avatarFileId: uploadedFile.$id,
  };

  try {
    await withTimeout(account.updatePrefs({ prefs }));
  } catch (error) {
    await storage
      .deleteFile({ bucketId: config.bucketId, fileId: uploadedFile.$id })
      .catch(() => undefined);
    throw error;
  }

  if (previousFileId && previousFileId !== uploadedFile.$id) {
    await storage
      .deleteFile({ bucketId: config.bucketId, fileId: previousFileId })
      .catch((error) =>
        console.warn("[Profile] Previous avatar cleanup skipped:", error)
      );
  }

  const user = toAppUser({ ...accountUser, prefs });
  const provider = accountUser.prefs?.provider === "google" ? "google" : "email";

  try {
    await syncUserProfile(user, provider);
  } catch (error) {
    console.warn("[Profile] Avatar profile sync skipped:", error);
  }

  return user;
}

export async function loginWithGoogle(): Promise<AppUser | null> {
  try {
    await clearCurrentSession();

    // Expo Router creates the active Expo Go callback URL, including the
    // current Metro host and port (for example, exp://192.168.1.68:8081).
    const redirectUri = Linking.createURL("/");
    console.log("[Auth] OAuth callback URL:", redirectUri);
    const response = account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: redirectUri,
      failure: redirectUri,
    });
    if (!response) throw new Error("Could not create the Google login URL");

    console.log("[Auth] Opening Google sign-in");

    const browserResult = await withTimeout(
      openAuthSessionAsync(response.toString(), redirectUri),
      120_000
    );
    if (browserResult.type !== "success")
      throw new Error("Google login was cancelled");

    console.log("[Auth] Google sign-in callback received");
    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await withTimeout(
      account.createSession({ userId, secret })
    );
    if (!session) throw new Error("Failed to create session");

    console.log("[Auth] Appwrite session created");

    return await finishAuthenticatedUser("google");
  } catch (error) {
    logAuthenticationFailure("Google sign-in failed", error);
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AppUser | null> {
  try {
    await clearCurrentSession();
    await withTimeout(account.createEmailPasswordSession({ email, password }));
    console.log("[Auth] Email session created");
    return await finishAuthenticatedUser("email");
  } catch (error) {
    logAuthenticationFailure("Email sign-in failed", error);
    throw error;
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
): Promise<AppUser | null> {
  try {
    await clearCurrentSession();
    await withTimeout(
      account.create({ userId: ID.unique(), name: name.trim(), email, password })
    );
    await withTimeout(account.createEmailPasswordSession({ email, password }));
    console.log("[Auth] Email account and session created");
    return await finishAuthenticatedUser("email");
  } catch (error) {
    logAuthenticationFailure("Email sign-up failed", error);
    throw error;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await withTimeout(account.get());
    if (result.$id) {
      console.log("[Auth] Active user restored");
      return toAppUser(result);
    }

    return null;
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? (error as { code?: number }).code
        : undefined;
    if (code !== 401)
      console.log("[Auth] Could not restore user session:", error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
