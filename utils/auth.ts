import { getCookie, setCookie, deleteCookie } from "cookies-next";

export interface User {
  id: string;
  nationalId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  kraPin?: string;
  role: string;
}

export interface LoginResult {
  message: string;
  user: User;
  redirect: string;
}

export const login = async (
  nationalId: string,
  password: string
): Promise<LoginResult | null> => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nationalId, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: { message: string } = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data: LoginResult = await response.json();

    // Store the user info in a cookie
    setCookie("user", JSON.stringify(data.user), {
      maxAge: 86400, // 1 day
      path: "/",
    });

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    deleteCookie("auth_token");
    deleteCookie("user");
    deleteCookie("user_role");
    sessionStorage.removeItem("userData");
    if (response.ok) {
      deleteCookie("auth_token");
      deleteCookie("user");
      deleteCookie("user_role");
      sessionStorage.removeItem("userData");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getUser = (): User | null => {
  const userStr = getCookie("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr as string) as User;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const isLoggedIn = (): boolean => {
  const token = getCookie("auth_token");
  return !!token;
};

export const getToken = (): string | null => {
  return getCookie("auth_token") as string | null;
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "ADMIN";
};
