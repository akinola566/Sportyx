import { apiRequest } from "./queryClient";
import { LoginUser, InsertUser } from "@shared/schema";

export async function loginUser(credentials: LoginUser) {
  return await apiRequest("POST", "/api/auth/login", credentials);
}

export async function registerUser(userData: InsertUser) {
  return await apiRequest("POST", "/api/auth/register", userData);
}

export async function logoutUser() {
  return await apiRequest("POST", "/api/auth/logout", undefined);
}

export async function activateId(activationCode: string) {
  return await apiRequest("POST", "/api/user/activate", { code: activationCode });
}

export async function checkAuth() {
  return await apiRequest("GET", "/api/auth/check", undefined);
}

export async function checkActivationStatus() {
  return await apiRequest("GET", "/api/user/activation-status", undefined);
}
