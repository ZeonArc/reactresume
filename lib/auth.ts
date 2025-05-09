"use client"

import type { User } from "./types"
import { supabase } from "./supabase"

// In a real application, this would be a server-side API call
// For demo purposes, we're using localStorage to simulate authentication

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<boolean> {
  try {
    // Register user with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error.message);
      return false;
    }
    
    return !!data.user;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    // First clear any existing session to avoid conflicts
    await supabase.auth.signOut({ scope: 'local' });
    
    // Then attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error || !data.user) {
      console.error("Login error:", error?.message);
      return null;
    }
    
    // Verify session was created
    const sessionCheck = await supabase.auth.getSession();
    if (!sessionCheck.data.session) {
      console.error("Session not created after login");
      return null;
    }
    
    // Format the user data
    const userData: User = {
      id: data.user.id,
      email: data.user.email || "",
      firstName: data.user.user_metadata.firstName || "",
      lastName: data.user.user_metadata.lastName || ""
    };
    
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export async function getUserSession(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    
    // Format the user data
    const userData: User = {
      id: data.user.id,
      email: data.user.email || "",
      firstName: data.user.user_metadata.firstName || "",
      lastName: data.user.user_metadata.lastName || ""
    };
    
    return userData;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    // Force cookie removal in addition to normal sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
    
    // Clear any local storage items related to auth if they exist
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supaLocalStorage');
      
      // Set a cookie to signal to middleware that a signout happened
      document.cookie = 'sign-out-event=true; path=/; max-age=60;';
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}
