"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ 
    className,
    textClassName,
    isExpanded = false
}: { 
    className?: string;
    textClassName?: string;
    isExpanded?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch
    return (
      <div className={cn("flex items-center text-ink-muted", className)}>
        <span className="h-11 w-11 flex items-center justify-center shrink-0">
          <Sun size={18} />
        </span>
        {isExpanded && <span className={cn("text-sm font-medium whitespace-nowrap pr-4", textClassName)}>Theme</span>}
      </div>
    )
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("flex items-center text-left w-full", className)}
      title="Toggle theme"
    >
      <span className="h-11 w-11 flex items-center justify-center shrink-0 relative">
        <Sun className={cn("absolute h-[18px] w-[18px] transition-all", isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
        <Moon className={cn("absolute h-[18px] w-[18px] transition-all", isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
      </span>
      {isExpanded && (
        <span className={cn("text-sm font-medium whitespace-nowrap pr-4 transition-all delay-100 duration-200", textClassName)}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  )
}

