"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delayOrder?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AnimatedCard({
  children,
  className,
  hoverEffect = true,
  delayOrder = 0,
  header,
  footer
}: AnimatedCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect) return;
    
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        delay: delayOrder * 0.1,
        ease: "easeOut" 
      }}
      className={cn("", className)}
    >
      <motion.div
        style={{ 
          perspective: 1000,
          transformStyle: "preserve-3d" 
        }}
        whileHover={{ 
          scale: hoverEffect ? 1.02 : 1,
          zIndex: 1
        }}
        animate={{ 
          rotateX: hoverEffect ? mousePosition.y * 5 : 0,
          rotateY: hoverEffect ? -mousePosition.x * 5 : 0
        }}
        onMouseMove={handleMouseMove}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all border shadow-lg bg-gradient-to-r from-white to-gray-50",
          hoverEffect && "hover:shadow-xl"
        )}>
          {header && <CardHeader>{header}</CardHeader>}
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
          
          {/* Subtle glass effect overlay */}
          <motion.div 
            className="absolute inset-0 bg-white/10 pointer-events-none"
            style={{
              background: hoverEffect ? 
                `radial-gradient(circle at ${mousePosition.x * 100 + 50}% ${mousePosition.y * 100 + 50}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)` :
                'none'
            }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
} 