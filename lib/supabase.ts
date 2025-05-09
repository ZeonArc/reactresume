import { createClient } from '@supabase/supabase-js';
import type { User } from './types';

// Hardcoded values for simplicity - ensure they match with middleware.ts
const supabaseUrl = 'https://xciyawumdtwyydelhclv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXlhd3VtZHR3eXlkZWxoY2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTA1MzEsImV4cCI6MjA2MjAyNjUzMX0.jEnB9ETeZAXDzHrmpZXRhqCE2GGUefJd033KDcXgDoU';

// Create client with basic config
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type alias instead of empty interface
type MockUser = User;

// Create a simple mock auth system for development/fallback
export const mockAuth = {
  isAuthenticated: false,
  user: null as MockUser | null,
  
  login(email: string, password: string) {
    // For development only - simple mock login
    if (email && password) {
      this.isAuthenticated = true;
      this.user = {
        id: 'mock-123',
        email: email,
        firstName: 'Demo',
        lastName: 'User'
      };
      
      // Store in session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mockAuthUser', JSON.stringify(this.user));
        sessionStorage.setItem('mockAuthState', 'authenticated');
      }
      
      return { success: true, user: this.user };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  
  logout() {
    this.isAuthenticated = false;
    this.user = null;
    
    // Clear from session
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mockAuthUser');
      sessionStorage.removeItem('mockAuthState');
    }
    
    return { success: true };
  },
  
  getSession() {
    // Try to get from session storage first
    if (typeof window !== 'undefined') {
      const authState = sessionStorage.getItem('mockAuthState');
      const userJson = sessionStorage.getItem('mockAuthUser');
      
      if (authState === 'authenticated' && userJson) {
        try {
          this.user = JSON.parse(userJson) as MockUser;
          this.isAuthenticated = true;
        } catch (e) {
          console.error('Error parsing mock user', e);
        }
      }
    }
    
    return {
      user: this.user,
      isAuthenticated: this.isAuthenticated
    };
  }
}; 