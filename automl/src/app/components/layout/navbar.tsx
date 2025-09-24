'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

const Navbar = () => {
  // const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    { name: 'Datasets', path: '/datasets' },
    { name: 'ML Models', path: '/mlmodels' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <motion.nav 
      className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent`}>
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
                <Link key={item.name} href={item.path} prefetch>
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

          {/* Right side icons, theme toggle, and button */}
          <div className="flex items-center space-x-4">
            {/* X Icon */}
            <motion.button
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </motion.button>

            {/* Mail Icon */}
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

            {/* Launch The Project Button */}
            <Link href="/dashboard" prefetch>
              <motion.span
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                🚀 Dashboard
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;