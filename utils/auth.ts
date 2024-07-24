import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export interface User {
  id: string;
  nationalId: string;
  // Add any other user fields you want to include
}

export interface LoginResult {
  message: string;
  user: User;
}

export const login = async (nationalId: string, password: string): Promise<LoginResult | null> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nationalId, password }),
      credentials: 'include', // This is important for including cookies
    });

    if (!response.ok) {
      const errorData: { message: string } = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data: LoginResult = await response.json();
    
    // We can store the user info in a cookie for easy access.
    setCookie('user', JSON.stringify(data.user), {
      maxAge: 86400, // 1 day
      path: '/',
    });

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      deleteCookie('auth_token');
      deleteCookie('user');
      sessionStorage.removeItem('userData');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getUser = (): User | null => {
  const userStr = getCookie('user');
  return userStr ? JSON.parse(userStr as string) as User : null;
};

export const isLoggedIn = (): boolean => {
  const token = getCookie('auth_token');
  console.log("auth_token cookie valueeeeeeee:", token);
  return !!token;
};

export const getToken = (): string | null => {
  return getCookie('auth_token') as string | null;
};