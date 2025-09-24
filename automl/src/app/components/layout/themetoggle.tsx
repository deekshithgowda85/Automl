"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  return (
    <div className="flex items-center">
      <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
        <div className="relative mx-2">
          {/* Hidden checkbox */}
          <input
            id="theme-toggle"
            type="checkbox"
            className="sr-only"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            role="switch"
            aria-label="Toggle dark mode"
          />
          {/* Toggle background */}
          <div
            className={`
              relative w-12 h-6 rounded-full border-2 p-1 transition-all duration-300 ease-in-out
              ${theme === 'dark'
                ? 'bg-slate-800 border-blue-400/30'
                : 'bg-yellow-200 border-yellow-400/30'
              }
              hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500/50
            `}
          >
            {/* Toggle slider */}
            <div
              className={`
                absolute w-5 h-5 rounded-full transition-all duration-300 ease-in-out
                ${theme === 'dark'
                  ? 'translate-x-6 bg-blue-500'
                  : 'translate-x-0 bg-yellow-500'
                }
              `}
            />
            {/* Icon container */}
            <div
              className={`
                absolute top-0.5 left-0.5 w-4 h-4 transition-all duration-300 ease-in-out z-10
                ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
              `}
            >
              <div className="relative w-full h-full">
                {/* Main circle (sun/moon) */}
                <div
                  className={`
                    absolute top-1/2 left-1/2 w-3 h-3 rounded-full transition-all duration-300 ease-in-out
                    ${theme === 'dark'
                      ? 'transform -translate-x-1/2 -translate-y-1/2 scale-100 shadow-inner bg-white'
                      : 'transform -translate-x-1/2 -translate-y-1/2 scale-50 bg-white'
                    }
                  `}
                  style={{
                    boxShadow: theme === 'dark'
                      ? 'inset 0.2em -0.2em 0 0.2em white'
                      : 'inset 0.4em -0.4em 0 0.5em white'
                  }}
                />
                {/* Sun rays */}
                {theme !== 'dark' && Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      absolute bg-white transition-all duration-300 ease-in-out
                      w-0.5 h-1.5 rounded-full top-1/2 left-1/2 origin-bottom
                      ${theme === 'dark' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                    `}
                    style={{
                      transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(${i % 2 === 0 ? '0.3em' : '0.25em'})`,
                      transformOrigin: '50% 100%'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}
