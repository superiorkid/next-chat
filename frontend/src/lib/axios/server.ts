import axios from "axios";
import { cookies } from "next/headers";

export async function createServerAxios() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
  });

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME as string)?.value;
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("[Axios] Could not read cookies on server:", err);
  }

  return instance;
}
