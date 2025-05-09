'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIcon, Mail, Settings, Shield, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user's resumes
    const fetchResumes = async () => {
      try {
        // In a real app, you'd fetch from your API
        // For now, we'll just simulate it
        setResumes([
          { id: 1, name: 'Software Developer Resume.pdf', updatedAt: new Date().toISOString() },
          { id: 2, name: 'Product Manager Resume.pdf', updatedAt: new Date().toISOString() }
        ]);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      
      // Force page refresh to ensure clean state
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-20 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{user.email?.split('@')[0] || 'User'}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>Email: {user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span>ID: {user.id.substring(0, 8)}...</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="resumes">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="resumes" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Your Resumes
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumes">
              <Card>
                <CardHeader>
                  <CardTitle>Your Resumes</CardTitle>
                  <CardDescription>
                    Manage your uploaded resumes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading your resumes...</div>
                  ) : resumes.length > 0 ? (
                    <div className="space-y-3">
                      {resumes.map((resume: any) => (
                        <div key={resume.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium">{resume.name}</p>
                              <p className="text-xs text-gray-500">
                                Updated {new Date(resume.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <h3 className="font-medium">No resumes found</h3>
                      <p className="text-sm text-gray-500 mb-4">Upload your first resume to get started</p>
                      <Button>Upload Resume</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-gray-500 mb-4">Update your password periodically to keep your account secure</p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-medium">Email Preferences</h3>
                      <p className="text-sm text-gray-500 mb-4">Manage your email notification settings</p>
                      <Button variant="outline">Update Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 