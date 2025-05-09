"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export function AnimatedButton({
  children,
  className,
  variant,
  size,
  loading = false,
  loadingText,
  icon,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn("relative overflow-hidden", className)}
        variant={variant}
        size={size}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
        
        {/* Subtle background animation */}
        <motion.span
          className="absolute inset-0 bg-white/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: loading ? 1.2 : 0, opacity: loading ? 0.1 : 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ repeat: loading ? Infinity : 0, duration: 1 }}
        />
      </Button>
    </motion.div>
  );
} 