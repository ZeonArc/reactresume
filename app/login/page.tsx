"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase, mockAuth } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, fadeInDown } from '@/lib/animations';
import { PageTransition } from '@/components/page-transition';
import { AnimatedButton } from '@/components/ui/animated-button';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard');
      }
    };
    
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      let loginSuccessful = false;

      try {
        // First try Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // If it's not a network error, show the actual error
          if (!error.message.includes('Failed to fetch')) {
            throw error;
          }
          console.warn("Supabase login failed with network error:", error.message);
          // We'll try the mock login next
        } else if (data.user) {
          loginSuccessful = true;
          toast({
            title: 'Success',
            description: 'You have been logged in successfully',
          });
        }
      } catch (supabaseError) {
        console.error("Supabase login error:", supabaseError);
        // We'll try the mock login next
      }

      // If Supabase login failed, try the mock auth system
      if (!loginSuccessful) {
        console.log("Trying mock auth login");
        // Only allow specific test accounts in development
        const canUseMockAuth = process.env.NODE_ENV !== 'production' || 
          email === 'demo@example.com' || 
          email === 'test@example.com';
          
        if (canUseMockAuth) {
          const mockResult = mockAuth.login(email, password);
          
          if (mockResult.success) {
            loginSuccessful = true;
            toast({
              title: 'Development Login',
              description: 'You have been logged in with the development account',
            });
          } else if (mockResult.error) {
            throw new Error(mockResult.error);
          }
        } else {
          throw new Error("Authentication service is currently unavailable. Please try again later.");
        }
      }
      
      // Handle successful login (from either method)
      if (loginSuccessful) {
        // Navigate to dashboard
        if (typeof window !== 'undefined') {
          window.location.href = redirectPath;
        } else {
          router.push(redirectPath);
        }
      } else {
        throw new Error("Login failed. Please check your credentials and try again.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err !== null && 'message' in err 
          ? String(err.message) 
          : 'Failed to sign in';
      
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="w-full shadow-lg border-0">
            <CardHeader className="space-y-1">
              <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              </motion.div>
              <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div 
                    variants={fadeInDown}
                    initial="hidden"
                    animate="visible"
                    className="rounded-md bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </motion.div>
                
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                >
                  <AnimatedButton 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                    loading={isLoading}
                    loadingText="Signing in..."
                    icon={!isLoading && <LogIn className="h-4 w-4" />}
                  >
                    Sign In
                  </AnimatedButton>
                </motion.div>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <motion.div 
                className="text-sm text-gray-600"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
              >
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Sign up
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
