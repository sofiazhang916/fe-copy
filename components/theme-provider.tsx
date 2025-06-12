"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const resolved = saved || (systemPrefersDark ? "dark" : "light")
    setThemeState(resolved)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme, isLoaded])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  if (!isLoaded) return null // prevent flash of incorrect theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
