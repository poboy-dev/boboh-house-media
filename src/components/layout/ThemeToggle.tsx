
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by only rendering after mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="p-2 w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 animate-scale-in" />
            ) : (
                <Moon className="h-5 w-5 animate-scale-in" />
            )}
        </button>
    );
};
