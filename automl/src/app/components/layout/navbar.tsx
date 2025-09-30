'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useState } from 'react';

const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Datasets', path: '/datasets' },
    { name: 'ML Models', path: '/mlmodels' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Desktop Navbar - Unchanged */}
      <motion.nav 
        className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent hidden md:block`}>
        <div className="w-full px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" prefetch>
              <motion.div 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="text-foreground text-3xl md:text-4xl font-extrabold tracking-widest select-none"
                  style={{ letterSpacing: '0.15em', opacity: 0.7 }}
                >
                  <span className="inline-block align-middle mr-2">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" fillOpacity="0.12" />
                      <path d="M8 24L24 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2.5"/>
                    </svg>
                  </span>
                  AutoML
                </div>
              </motion.div>
            </Link>

            {/* Navigation Links - Centered with Capsule Container */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-lg mx-auto">
              <motion.div 
                className="flex items-center space-x-1 bg-background/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-border"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {navItems.map((item, index) => (
                  <Link key={item.name} href={item.path} prefetch={true}>
                    <motion.span
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium px-4 py-2 rounded-full hover:bg-accent"
                      whileHover={{ 
                        y: -1,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* Right side icons, theme toggle, and auth buttons */}
            <div className="flex items-center space-x-4">
              {/* Social Icons */}
              <motion.a
                href="https://github.com/deekshithgowda85/Automl"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs bg-muted/30 hover:bg-muted/50 px-2 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>★ Star</span>
              </motion.a>

              <motion.button
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Authentication Section */}
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <div className="flex items-center space-x-3">
                      {/* Dashboard Button for authenticated users */}
                      <Link href="/dashboard" prefetch>
                        <motion.span
                          className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl relative overflow-hidden group"
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                          <span className="relative flex items-center gap-1">
                            🚀 Dashboard
                          </span>
                        </motion.span>
                      </Link>
                      
                      {/* Profile Menu */}
                      <div className="relative">
                        <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8"
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      {/* Sign In Button */}
                      <Link href="/sign-in" prefetch>
                        <motion.span
                          className="text-foreground hover:text-primary transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Sign In
                        </motion.span>
                      </Link>
                      
                      {/* Sign Up Button */}
                      <Link href="/sign-up" prefetch>
                        <motion.span
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Sign Up
                        </motion.span>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav 
        className="navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm md:hidden">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <Link href="/" prefetch>
              <motion.div 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-foreground text-2xl font-extrabold tracking-wide select-none flex items-center">
                  <span className="inline-block align-middle mr-1.5">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" fillOpacity="0.12" />
                      <path d="M8 24L24 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2.5"/>
                    </svg>
                  </span>
                  AutoML
                </div>
              </motion.div>
            </Link>

            {/* Mobile Right Side */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              
              {/* User Button or Auth */}
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7"
                        }
                      }}
                    />
                  ) : (
                    <Link href="/sign-in" prefetch>
                      <motion.span
                        className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In
                      </motion.span>
                    </Link>
                  )}
                </>
              )}
              
              {/* Hamburger Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground p-3 rounded-lg hover:bg-accent/80 transition-colors border border-border/50 bg-background/50"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  className="w-6 h-6 relative"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 8 }
                    }}
                    className="absolute top-0 left-0 w-full h-0.5 bg-current origin-center rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    className="absolute top-2.5 left-0 w-full h-0.5 bg-current rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -8 }
                    }}
                    className="absolute top-5 left-0 w-full h-0.5 bg-current origin-center rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden bg-background/98 backdrop-blur-lg border-t border-border/50 shadow-lg"
        >
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ 
                  x: isMobileMenuOpen ? 0 : -20,
                  opacity: isMobileMenuOpen ? 1 : 0
                }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
              >
                <Link 
                  href={item.path} 
                  prefetch
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-xl text-foreground hover:bg-accent/80 transition-colors font-medium text-lg border border-transparent hover:border-border/30"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* Dashboard Link for Authenticated Users */}
            {isSignedIn && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ 
                  x: isMobileMenuOpen ? 0 : -20,
                  opacity: isMobileMenuOpen ? 1 : 0
                }}
                transition={{ delay: navItems.length * 0.1, duration: 0.2 }}
              >
                <Link 
                  href="/dashboard" 
                  prefetch
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-center text-lg shadow-md hover:shadow-lg transition-all"
                >
                  🚀 Dashboard
                </Link>
              </motion.div>
            )}

            {/* Mobile Footer with Theme Toggle and GitHub */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ 
                x: isMobileMenuOpen ? 0 : -20,
                opacity: isMobileMenuOpen ? 1 : 0
              }}
              transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.2 }}
              className="pt-4 border-t border-border space-y-3"
            >
              {/* Theme Toggle Section */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/20">
                <span className="text-foreground font-medium">Theme</span>
                <ThemeToggle />
              </div>
              
              {/* GitHub Link */}
              <a
                href="https://github.com/deekshithgowda85/Automl"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>★ Star on GitHub</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Navbar;