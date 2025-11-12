import { useState, useEffect } from 'react';

// NOTE: This auth hook now simulates async calls to a backend API and manages a mock JWT.
// The backend endpoints (/api/auth/*) are hypothetical.

interface User {
  email: string;
}

export type SocialProvider = 'google' | 'twitter' | 'github';

// A mock JWT decoder to extract user info from a token payload
const decodeJwt = (token: string): any => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for auth token on initial load
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // In a real app, you'd verify the token with the backend.
        // Here, we'll decode it and check the mock expiration.
        const decoded = decodeJwt(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
            setUser({ email: decoded.sub });
        } else {
            localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error("Failed to process auth token", error);
      localStorage.removeItem('authToken');
    }
  }, []);

  const apiAuth = async (endpoint: string, body: { email: string, password?: string }): Promise<{ ok: boolean, token?: string, error?: string }> => {
    console.log(`[MOCK API] Calling ${endpoint} for ${body.email}`);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    
    if (endpoint.includes('register')) {
        if (body.email === 'exists@example.com') {
            return { ok: false, error: 'User already exists' };
        }
    } else if (endpoint.includes('login')) {
        if (body.email !== 'user@example.com' || body.password !== 'password123') {
            return { ok: false, error: 'Invalid credentials' };
        }
    }
    
    // If successful, create a mock JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: body.email, exp: Math.floor(Date.now() / 1000) + (60 * 60) })); // Expires in 1 hour
    const signature = 'mock-signature'; // In reality, this is created on the server
    const token = `${header}.${payload}.${signature}`;

    return { ok: true, token };
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await apiAuth('/api/auth/login', { email, password });
    if (res.ok && res.token) {
      localStorage.setItem('authToken', res.token);
      setUser({ email });
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await apiAuth('/api/auth/register', { email, password });
    if (res.ok && res.token) {
      localStorage.setItem('authToken', res.token);
      setUser({ email });
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const socialLogin = async (provider: SocialProvider): Promise<{ success: boolean; error?: string }> => {
    const email = `${provider}-user@example.com`;
    const res = await apiAuth(`/api/auth/social/${provider}`, { email });
    if (res.ok && res.token) {
      localStorage.setItem('authToken', res.token);
      setUser({ email });
      return { success: true };
    }
    return { success: false, error: res.error };
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return { user, login, register, logout, socialLogin };
}