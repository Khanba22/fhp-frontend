import type { ThemeColors } from "@/contexts/useTheme"

// Define theme presets
export const themePresets: Record<string, { light: ThemeColors; dark: ThemeColors }> = {
  default: {
    light: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#ec4899",
      background: {
        main: "#ffffff",
        light: "#f9fafb",
        dark: "#f3f4f6",
      },
      text: {
        primary: "#111827",
        secondary: "#4b5563",
        muted: "#9ca3af",
      },
      border: "#e5e7eb",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      dropShadow: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
      backdropFilter: "blur(8px)",
    },
    dark: {
      primary: "#818cf8",
      secondary: "#a78bfa",
      accent: "#f472b6",
      background: {
        main: "#111827",
        light: "#1f2937",
        dark: "#0f172a",
      },
      text: {
        primary: "#f9fafb",
        secondary: "#e5e7eb",
        muted: "#9ca3af",
      },
      border: "#374151",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      dropShadow: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.3)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.2))",
      backdropFilter: "blur(8px)",
    },
  },
  ocean: {
    light: {
      primary: "#0ea5e9",
      secondary: "#06b6d4",
      accent: "#14b8a6",
      background: {
        main: "#ffffff",
        light: "#f0f9ff",
        dark: "#e0f2fe",
      },
      text: {
        primary: "#0c4a6e",
        secondary: "#0369a1",
        muted: "#7dd3fc",
      },
      border: "#bae6fd",
      shadow: "0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)",
      dropShadow: "drop-shadow(0 4px 3px rgb(14 165 233 / 0.07)) drop-shadow(0 2px 2px rgb(14 165 233 / 0.06))",
      backdropFilter: "blur(8px)",
    },
    dark: {
      primary: "#38bdf8",
      secondary: "#22d3ee",
      accent: "#2dd4bf",
      background: {
        main: "#0c4a6e",
        light: "#075985",
        dark: "#082f49",
      },
      text: {
        primary: "#f0f9ff",
        secondary: "#e0f2fe",
        muted: "#7dd3fc",
      },
      border: "#0284c7",
      shadow: "0 4px 6px -1px rgba(14, 165, 233, 0.3), 0 2px 4px -1px rgba(14, 165, 233, 0.2)",
      dropShadow: "drop-shadow(0 4px 3px rgb(14 165 233 / 0.3)) drop-shadow(0 2px 2px rgb(14 165 233 / 0.2))",
      backdropFilter: "blur(8px)",
    },
  },
  forest: {
    light: {
      primary: "#10b981",
      secondary: "#059669",
      accent: "#84cc16",
      background: {
        main: "#ffffff",
        light: "#f0fdf4",
        dark: "#dcfce7",
      },
      text: {
        primary: "#14532d",
        secondary: "#166534",
        muted: "#86efac",
      },
      border: "#bbf7d0",
      shadow: "0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06)",
      dropShadow: "drop-shadow(0 4px 3px rgb(16 185 129 / 0.07)) drop-shadow(0 2px 2px rgb(16 185 129 / 0.06))",
      backdropFilter: "blur(8px)",
    },
    dark: {
      primary: "#34d399",
      secondary: "#10b981",
      accent: "#a3e635",
      background: {
        main: "#14532d",
        light: "#166534",
        dark: "#052e16",
      },
      text: {
        primary: "#f0fdf4",
        secondary: "#dcfce7",
        muted: "#86efac",
      },
      border: "#15803d",
      shadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.2)",
      dropShadow: "drop-shadow(0 4px 3px rgb(16 185 129 / 0.3)) drop-shadow(0 2px 2px rgb(16 185 129 / 0.2))",
      backdropFilter: "blur(8px)",
    },
  },
  sunset: {
    light: {
      primary: "#f97316",
      secondary: "#f59e0b",
      accent: "#ef4444",
      background: {
        main: "#ffffff",
        light: "#fff7ed",
        dark: "#ffedd5",
      },
      text: {
        primary: "#7c2d12",
        secondary: "#9a3412",
        muted: "#fdba74",
      },
      border: "#fed7aa",
      shadow: "0 4px 6px -1px rgba(249, 115, 22, 0.1), 0 2px 4px -1px rgba(249, 115, 22, 0.06)",
      dropShadow: "drop-shadow(0 4px 3px rgb(249 115 22 / 0.07)) drop-shadow(0 2px 2px rgb(249 115 22 / 0.06))",
      backdropFilter: "blur(8px)",
    },
    dark: {
      primary: "#fb923c",
      secondary: "#fbbf24",
      accent: "#f87171",
      background: {
        main: "#7c2d12",
        light: "#9a3412",
        dark: "#431407",
      },
      text: {
        primary: "#fff7ed",
        secondary: "#ffedd5",
        muted: "#fdba74",
      },
      border: "#c2410c",
      shadow: "0 4px 6px -1px rgba(249, 115, 22, 0.3), 0 2px 4px -1px rgba(249, 115, 22, 0.2)",
      dropShadow: "drop-shadow(0 4px 3px rgb(249 115 22 / 0.3)) drop-shadow(0 2px 2px rgb(249 115 22 / 0.2))",
      backdropFilter: "blur(8px)",
    },
  },
  lavender: {
    light: {
      primary: "#8b5cf6",
      secondary: "#a855f7",
      accent: "#d946ef",
      background: {
        main: "#ffffff",
        light: "#f5f3ff",
        dark: "#ede9fe",
      },
      text: {
        primary: "#4c1d95",
        secondary: "#5b21b6",
        muted: "#c4b5fd",
      },
      border: "#ddd6fe",
      shadow: "0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)",
      dropShadow: "drop-shadow(0 4px 3px rgb(139 92 246 / 0.07)) drop-shadow(0 2px 2px rgb(139 92 246 / 0.06))",
      backdropFilter: "blur(8px)",
    },
    dark: {
      primary: "#a78bfa",
      secondary: "#c084fc",
      accent: "#e879f9",
      background: {
        main: "#4c1d95",
        light: "#5b21b6",
        dark: "#2e1065",
      },
      text: {
        primary: "#f5f3ff",
        secondary: "#ede9fe",
        muted: "#c4b5fd",
      },
      border: "#7c3aed",
      shadow: "0 4px 6px -1px rgba(139, 92, 246, 0.3), 0 2px 4px -1px rgba(139, 92, 246, 0.2)",
      dropShadow: "drop-shadow(0 4px 3px rgb(139 92 246 / 0.3)) drop-shadow(0 2px 2px rgb(139 92 246 / 0.2))",
      backdropFilter: "blur(8px)",
    },
  },
}

// Get default themes
export const defaultLightTheme = themePresets.default.light
export const defaultDarkTheme = themePresets.default.dark

// Helper function to get theme based on mode
export function getThemeByPreset(presetName: string, isDark: boolean): ThemeColors {
  const preset = themePresets[presetName] || themePresets.default
  return isDark ? preset.dark : preset.light
}
