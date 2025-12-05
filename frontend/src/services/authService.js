import { API_BASE_URL } from '../config/api.js'

const API_URL = `${API_BASE_URL}/auth`;

export const authService = {
  async register(userData) {
    console.log('🌐 Sending registration request to backend:', userData.email);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      
      console.log('📡 Registration response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Registration request failed:', error);
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('✅ Registration request successful');
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  async login(credentials) {
    console.log('🌐 Sending login request to backend:', credentials.email);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      console.log('📡 Login response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Login request failed:', error);
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      console.log('✅ Login request successful');
      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  async logout(accessToken) {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return response.json();
  },

  async getCurrentUser(accessToken) {
    const response = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    return response.json();
  },

  async refreshToken() {
    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      // Don't log error - 403 is expected when no refresh token exists
      throw new Error('Token refresh failed');
    }
    
    return response.json();
  }
};
