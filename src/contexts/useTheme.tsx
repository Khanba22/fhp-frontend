"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { defaultLightTheme, defaultDarkTheme } from "@/lib/theme-presets"

// Define theme types
export type ThemeColors = {
  primary: string
  secondary: string
  accent: string
  background: {
    main: string
    light: string
    dark: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
  }
  border: string
  shadow: string
  dropShadow: string
  backdropFilter: string
}

// Define theme options
export type ThemeOption = "light" | "dark" | "system"

// Define the context type
type ThemeContextType = {
  colors: ThemeColors
  theme: ThemeOption
  setTheme: (theme: ThemeOption) => void
  handleSetTheme: (themeColors: ThemeColors) => void
  applyThemeToDocument: (colors: ThemeColors) => void
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Create provider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeOption>("system")
  const [colors, setColors] = useState<ThemeColors>(defaultLightTheme)
  const [customLightTheme, setCustomLightTheme] = useState<ThemeColors | null>(null)
  const [customDarkTheme, setCustomDarkTheme] = useState<ThemeColors | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Apply theme colors to CSS custom properties
  const applyThemeToDocument = (themeColors: ThemeColors) => {
    if (typeof document === "undefined") return

    const root = document.documentElement

    // Apply colors as CSS custom properties
    root.style.setProperty("--color-primary", themeColors.primary)
    root.style.setProperty("--color-secondary", themeColors.secondary)
    root.style.setProperty("--color-accent", themeColors.accent)
    root.style.setProperty("--color-background-main", themeColors.background.main)
    root.style.setProperty("--color-background-light", themeColors.background.light)
    root.style.setProperty("--color-background-dark", themeColors.background.dark)
    root.style.setProperty("--color-text-primary", themeColors.text.primary)
    root.style.setProperty("--color-text-secondary", themeColors.text.secondary)
    root.style.setProperty("--color-text-muted", themeColors.text.muted)
    root.style.setProperty("--color-border", themeColors.border)
    root.style.setProperty("--shadow", themeColors.shadow)
    root.style.setProperty("--drop-shadow", themeColors.dropShadow)
    root.style.setProperty("--backdrop-filter", themeColors.backdropFilter)

    // Apply background color to body
    document.body.style.backgroundColor = themeColors.background.main
    document.body.style.color = themeColors.text.primary
  }

  // Function to handle setting a complete theme
  const handleSetTheme = (themeColors: ThemeColors) => {
    // Update the current colors immediately
    setColors(themeColors)

    // Apply to document
    applyThemeToDocument(themeColors)

    if (!isMounted) return

    // Store the custom theme for the current mode
    const isDarkMode = getCurrentDarkMode()

    try {
      if (isDarkMode) {
        setCustomDarkTheme(themeColors)
        localStorage.setItem("custom-theme-dark", JSON.stringify(themeColors))
      } else {
        setCustomLightTheme(themeColors)
        localStorage.setItem("custom-theme-light", JSON.stringify(themeColors))
      }
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  // Get current dark mode state
  const getCurrentDarkMode = () => {
    if (!isMounted) return false
    return theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  }

  // Function to set theme mode (light/dark/system)
  const setTheme = (newTheme: ThemeOption) => {
    setThemeState(newTheme)

    if (!isMounted) return

    try {
      localStorage.setItem("theme", newTheme)
    } catch (error) {
      console.error("Error saving theme preference:", error)
    }

    // Apply theme immediately
    applyThemeMode(newTheme)
  }

  // Apply theme mode
  const applyThemeMode = (themeMode: ThemeOption) => {
    if (!isMounted) return

    let isDark = false

    if (themeMode === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    } else {
      isDark = themeMode === "dark"
    }

    // Update document class
    document.documentElement.classList.toggle("dark", isDark)

    // Choose appropriate theme colors
    let newColors: ThemeColors
    if (isDark) {
      newColors = customDarkTheme || defaultDarkTheme
    } else {
      newColors = customLightTheme || defaultLightTheme
    }

    setColors(newColors)
    applyThemeToDocument(newColors)
  }

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load custom themes from localStorage
  useEffect(() => {
    if (!isMounted) return

    try {
      const savedLightTheme = localStorage.getItem("custom-theme-light")
      if (savedLightTheme) {
        const parsed = JSON.parse(savedLightTheme)
        setCustomLightTheme(parsed)
      }

      const savedDarkTheme = localStorage.getItem("custom-theme-dark")
      if (savedDarkTheme) {
        const parsed = JSON.parse(savedDarkTheme)
        setCustomDarkTheme(parsed)
      }
    } catch (error) {
      console.error("Error loading custom themes:", error)
    }
  }, [isMounted])

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (!isMounted) return

    try {
      const savedTheme = localStorage.getItem("theme") as ThemeOption | null

      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme)
        applyThemeMode(savedTheme)
      } else {
        // Default to system theme
        setThemeState("system")
        applyThemeMode("system")
      }
    } catch (error) {
      console.error("Error initializing theme:", error)
      // Fallback to light theme
      setThemeState("light")
      applyThemeMode("light")
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyThemeMode("system")
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, customLightTheme, customDarkTheme])

  // Update colors when custom themes change
  useEffect(() => {
    if (!isMounted) return

    const isDark = getCurrentDarkMode()
    const newColors = isDark ? customDarkTheme || defaultDarkTheme : customLightTheme || defaultLightTheme

    setColors(newColors)
    applyThemeToDocument(newColors)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customLightTheme, customDarkTheme, theme, isMounted])

  return (
    <ThemeContext.Provider value={{ colors, theme, setTheme, handleSetTheme, applyThemeToDocument }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Create a hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
