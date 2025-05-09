'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Home, FileText, BookOpen, BriefcaseIcon, LayoutDashboard, Zap } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Define all nav items to be available
  const navItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Resume Analysis", href: "/dashboard", icon: <FileText size={18} /> },
    { name: "Career Paths", href: "/courses", icon: <BookOpen size={18} /> },
    { name: "Job Board", href: "/jobs", icon: <BriefcaseIcon size={18} /> },
    { name: "SkillGPT", href: "/skillgpt", icon: <Sparkles size={18} /> }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : pathname === "/" 
            ? "bg-transparent" 
            : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <Zap className={`h-6 w-6 ${scrolled || pathname !== "/" ? "text-blue-600" : "text-white"}`} />
            <span className={`text-xl font-bold ml-1 ${
              scrolled || pathname !== "/" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent" 
                : "text-white"
            }`}>
              SkillBridge
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center text-sm font-medium transition-colors ${
                pathname === item.href
                  ? scrolled || pathname !== "/" 
                    ? "text-blue-600" 
                    : "text-white border-b-2 border-white"
                  : scrolled || pathname !== "/" 
                    ? "text-gray-600 hover:text-blue-600" 
                    : "text-white/90 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="ml-1">{item.name}</span>
            </Link>
          ))}
          
          <div className="pl-2 border-l border-gray-200">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:from-blue-700 hover:to-indigo-800"
              size="sm"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={scrolled || pathname !== "/" ? "text-gray-700" : "text-white"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 rounded-lg ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={closeMenu}
              >
                <div className="w-8">{item.icon}</div>
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-3 mt-3 border-t border-gray-100">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:from-blue-700 hover:to-indigo-800"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}