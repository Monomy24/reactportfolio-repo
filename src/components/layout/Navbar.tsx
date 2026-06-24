import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor viewport tracking loops to inject visual styling on scroll operations
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Sandbox', href: '#sandbox' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/70 backdrop-blur-md border-b border-zinc-900/50 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo / Branding Mark */}
          <a href="#" className="font-mono text-sm tracking-tight font-bold hover:text-emerald-400 transition-colors">
            Cejay<span className="text-emerald-500">.dev</span>
          </a>

          {/* Desktop Navigation Links Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-mono font-medium text-zinc-400">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-zinc-100 transition-colors">
                {link.name}
              </a>
            ))}
            <a href="#admin" className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700/80 text-zinc-300 text-xs rounded-xl transition-all">
              Console
            </a>
          </nav>

          {/* Mobile Menu Interactive Trigger */}
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-zinc-400 hover:text-zinc-100 relative z-50 outline-none"
            aria-label="Toggle navigation drawer"
          >
            <span className={`w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Responsive Mobile Drawer Sliding Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-zinc-950/95 backdrop-blur-lg z-30 md:hidden flex flex-col justify-center p-8"
          >
            <nav className="flex flex-col gap-6 text-2xl font-bold tracking-tight text-zinc-400">
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-emerald-400 transition-colors font-sans"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="h-[1px] bg-zinc-900 my-2"
              />
              <motion.a
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.05 }}
                href="#admin"
                onClick={() => setIsOpen(false)}
                className="text-sm font-mono text-emerald-400 hover:underline"
              >
                → Initialize System Console
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
