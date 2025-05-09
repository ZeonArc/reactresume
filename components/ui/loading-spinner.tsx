"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "white";
  text?: string;
  textPosition?: "top" | "bottom" | "right" | "left";
}

export function LoadingSpinner({
  className,
  size = "md",
  color = "primary",
  text,
  textPosition = "bottom"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const colorClasses = {
    default: "text-gray-500",
    primary: "text-blue-600",
    secondary: "text-indigo-600",
    white: "text-white"
  };

  const containerClasses = {
    bottom: "flex flex-col items-center gap-3",
    top: "flex flex-col-reverse items-center gap-3",
    left: "flex flex-row-reverse items-center gap-3",
    right: "flex flex-row items-center gap-3"
  };

  // Spinner animation
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  // Circle animation variants
  const circleVariants = {
    initial: { 
      opacity: 1
    },
    animate: { 
      opacity: [1, 0.5, 1],
      scale: [1, 0.8, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={cn(containerClasses[textPosition], className)}>
      <div className="relative">
        <motion.div
          className={cn(
            "rounded-full border-t-2 border-b-2",
            colorClasses[color],
            sizeClasses[size]
          )}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
        
        <motion.div
          variants={circleVariants}
          initial="initial"
          animate="animate"
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full",
            sizeClasses[size].split(" ")[0].replace("w-", "w-1/"),
            sizeClasses[size].split(" ")[1].replace("h-", "h-1/"),
            color === "white" ? "bg-white/30" : `bg-${colorClasses[color].split("-")[1]}-400/30`
          )}
        />
      </div>

      {text && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-sm font-medium",
            colorClasses[color]
          )}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
}