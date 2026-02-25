'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function safeGetTheme(): Theme | null {
    if (typeof window === 'undefined') return null;
    try {
        const saved = window.localStorage.getItem('stablemind-theme');
        if (saved === 'light' || saved === 'dark') return saved;
    } catch {
        // localStorage not available (e.g. SSR, incognito restrictions)
    }
    return null;
}

function safeSaveTheme(theme: Theme) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem('stablemind-theme', theme);
    } catch {
        // Silently fail
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const saved = safeGetTheme();
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        safeSaveTheme(next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
