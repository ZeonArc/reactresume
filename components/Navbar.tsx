'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            ResumeHub
          </Link>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/') 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Home
          </Link>
          
          <Link 
            href="/project-ideas" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/project-ideas') 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Project Ideas
          </Link>
          
          <Link 
            href="/career-tools" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/career-tools') 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Career Tools
          </Link>
          
          <Link 
            href="/dashboard" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/dashboard') 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}