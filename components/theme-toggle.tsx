"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`
        h-10 w-10 rounded-full 
        flex items-center justify-center 
        bg-[#e6f0ff] text-black 
        dark:bg-[#73a9e9] dark:text-white 
        transition-colors
      `}
    >
      <Sun className="h-[18px] w-[18px] dark:hidden" />
      <Moon className="h-[18px] w-[18px] hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
