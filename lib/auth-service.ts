import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function signIn({ email, password }: AuthCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUp({ email, password }: AuthCredentials) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  // Use global scope to clear all sessions and storage
  const { error } = await supabase.auth.signOut({ scope: 'global' });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Clear any local storage items related to auth if they exist
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supaLocalStorage');
    
    // Set a cookie to signal to middleware that a signout happened
    document.cookie = 'sign-out-event=true; path=/; max-age=60;';
  }
  
  return true;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Set up auth state change listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user || null);
  });
} 