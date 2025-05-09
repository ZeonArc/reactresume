"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TestAccount() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  
  const createTestAccount = async () => {
    setIsCreating(true);
    
    try {
      // Create a test user in Supabase
      const email = 'test@example.com';
      const password = 'password123';
      
      // First check if user exists by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If sign in successful, user exists
      if (!signInError) {
        toast({
          title: 'Test account already exists',
          description: `Email: ${email}, Password: ${password}`,
        });
        
        // Redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 1500);
        return;
      }
      
      // Create new test user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: 'Test',
            lastName: 'User'
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: 'Test account created!',
        description: `Email: ${email}, Password: ${password}`,
      });
      
      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create test account',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold">Create Test Account</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.p 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Click the button below to create a test account for login:
            </motion.p>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button 
                onClick={createTestAccount} 
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
              >
                {isCreating ? 'Creating...' : 'Create Test Account'}
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="font-bold text-blue-800">Test Account Credentials</h3>
              <p className="mt-2"><strong>Email:</strong> test@example.com</p>
              <p><strong>Password:</strong> password123</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}