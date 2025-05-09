"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

interface MotionLayoutProps {
  children: ReactNode;
}

export default function MotionLayout({ children }: MotionLayoutProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
} 