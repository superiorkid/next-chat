import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

const isServer = typeof window === "undefined";

async function createAxiosInstance(): Promise<AxiosInstance> {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    withCredentials: true,
  });

  if (isServer) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(process.env.COOKIE_NAME as string)?.value;
      if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("[Axios] Could not read cookies on server:", error);
    }
  }

  instance.interceptors.request.use((config) => config);
  return instance;
}

export const axiosInstancePromise = createAxiosInstance();
