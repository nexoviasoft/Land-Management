"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Home, Info, Mail, Image as ImageIcon, Target, LogIn, Shield, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const nav = document.getElementById("mobile-menu");
      const toggle = document.getElementById("menu-toggle");
      if (nav && toggle && !nav.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Mission", href: "/mission", icon: Target },
  ];

  const isLinkActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname?.startsWith(href));
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as any },
    }),
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: "easeOut" as any } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeIn" as any } },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" as any },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)", transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const logoVariants = {
    hover: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" as any } },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-lg"
        : "border-b border-slate-200/50 bg-white/80 backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo */}
          <motion.div whileHover="hover" variants={logoVariants}>
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
              <motion.div
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </motion.div>
              <motion.span
                className="hidden sm:inline text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent"
                whileHover={{ letterSpacing: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                LandSync
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, i) => {
              const isActive = isLinkActive(link.href);
              const IconComponent = link.icon;
              return (
                <motion.div key={link.href} custom={i} variants={linkVariants} whileHover="hover">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${isActive ? "text-emerald-600 font-semibold bg-emerald-50" : "text-slate-700 hover:text-emerald-600"
                      }`}
                  >
                    <motion.div whileHover={{ rotate: 15, scale: 1.2 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                      <IconComponent className="w-4 h-4" strokeWidth={2} />
                    </motion.div>
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link
                href="/dashboard/user"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg bg-slate-100 text-slate-700"
              >
                <LogIn className="w-4 h-4" strokeWidth={2} />
                <span className="hidden sm:inline">User Portal</span>
              </Link>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 text-white shadow-md"
              >
                <Shield className="w-4 h-4" strokeWidth={2} />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            id="menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 hover:bg-slate-100 rounded-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                  <X className="w-6 h-6 text-slate-700" strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                  <Menu className="w-6 h-6 text-slate-700" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden pb-4 border-t border-slate-200 pt-4 space-y-1 overflow-hidden"
            >
              <motion.div className="flex flex-col gap-1 mb-4">
                {navLinks.map((link, i) => {
                  const isActive = isLinkActive(link.href);
                  const IconComponent = link.icon;
                  return (
                    <motion.div key={link.href} custom={i} variants={mobileLinkVariants} initial="hidden" animate="visible">
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${isActive ? "text-emerald-600 bg-emerald-50" : "text-slate-700 hover:text-emerald-600"
                          }`}
                      >
                        <IconComponent className="w-5 h-5" strokeWidth={2} />
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div className="flex flex-col gap-2 pt-4 border-t border-slate-200" custom={5} variants={mobileLinkVariants} initial="hidden" animate="visible">
                <Link href="/dashboard/user" className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-lg bg-slate-100 text-slate-700">
                  <LogIn className="w-5 h-5" strokeWidth={2} />
                  User Portal
                </Link>
                <Link href="/dashboard/overview" className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-lg bg-emerald-600 text-white shadow-md">
                  <Shield className="w-5 h-5" strokeWidth={2} />
                  Admin Portal
                </Link>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}