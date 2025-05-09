import { Metadata } from "next"
import SkillGPTPage from "@/components/SkillGPTPage"

export const metadata: Metadata = {
  title: "SkillGPT - Your AI Career Assistant",
  description: "Chat with SkillGPT for personalized career advice, resume tips, and help with building projects",
}

export default function SkillGPT() {
  return <SkillGPTPage />
} 