const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export const isDemoMode = process.env.EXPO_PUBLIC_DEMO_MODE === "true";

export function getApiUrl() {
  if (!apiUrl) {
    throw new Error("Defina EXPO_PUBLIC_API_URL para conectar o aplicativo a API.");
  }

  return apiUrl;
}
