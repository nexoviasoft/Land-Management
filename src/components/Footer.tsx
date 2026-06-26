"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Home,
  Info,
  Image as ImageIcon,
  Target,
  LogIn,
  Shield,
  Phone,
  MapIcon,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const stats = [
  { num: "3.2M+", label: "Khatian Records" },
  { num: "64 Dist", label: "Districts Covered" },
  { num: "487K", label: "Mouza Mapped" },
  { num: "99.8%", label: "System Uptime" },
];

const districts = [
  { name: "Dhaka", active: true },
  { name: "Chittagong", active: true },
  { name: "Rajshahi", active: true },
  { name: "Khulna", active: false },
  { name: "Sylhet", active: true },
  { name: "Barisal", active: false },
  { name: "Rangpur", active: false },
  { name: "Mymensingh", active: false },
  { name: "Comilla", active: false },
  { name: "Gazipur", active: false },
  { name: "Narayanganj", active: false },
  { name: "Tangail", active: false },
];

const navigationLinks = [
  { href: "/", label: "Home Portal", icon: Home },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/gallery", label: "Records Gallery", icon: ImageIcon },
  { href: "/mission", label: "Our Mission", icon: Target },
];

const portalLinks = [
  { href: "/dashboard/user", label: "Citizen Console", icon: LogIn },
  { href: "/dashboard/admin", label: "Admin Registry", icon: Shield },
  { href: "/contact", label: "Support Center", icon: Phone },
  { href: "/verify", label: "Record Verification", icon: CheckCircle },
];

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: i * 0.05 },
    }),
    hover: { x: 4, transition: { duration: 0.2 } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative overflow-hidden border-t border-slate-200/30 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950"
    >
      {/* Animated grid overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-12 py-16 lg:flex-row lg:gap-16"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="max-w-xs">
            <motion.div
              className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MapPin className="h-6 w-6 text-white" strokeWidth={2.5} />
            </motion.div>
            <h3 className="mb-2 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              LandSync
            </h3>
            <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
              ILMIS · Bangladesh
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              ভূমি মন্ত্রণালয় অনুমোদিত জাতীয় ভূমি নিবন্ধন ও মালিকানা যাচাই
              প্ল্যাটফর্ম। নিরাপদ ও স্বচ্ছ ডিজিটাল ভূমি ব্যবস্থাপনা।
            </p>
          </motion.div>

          {/* Links Grid */}
          <motion.div
            variants={containerVariants}
            className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Navigation Section */}
            <motion.div variants={itemVariants}>
              <h4 className="mb-6 text-sm font-semibold text-emerald-400">
                Navigation
              </h4>
              <ul className="space-y-3">
                {navigationLinks.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.href}
                      custom={i}
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-emerald-300"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Portals Section */}
            <motion.div variants={itemVariants}>
              <h4 className="mb-6 text-sm font-semibold text-emerald-400">
                Portals
              </h4>
              <ul className="space-y-3">
                {portalLinks.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.href}
                      custom={i}
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-emerald-300"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Government Support Section */}
            <motion.div variants={itemVariants}>
              <h4 className="mb-6 text-sm font-semibold text-emerald-400">
                Government Support
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Ministry of Land
                    </p>
                    <p className="text-xs text-slate-500">Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Office Hours
                    </p>
                    <p className="text-xs text-slate-500">Sun–Thu · 9:00–17:00</p>
                  </div>
                </div>

                <motion.div
                  className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 border border-emerald-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-400">Toll-Free</p>
                    <p className="font-mono text-sm font-semibold text-emerald-400">
                      16122
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Bar with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-0 border-y border-slate-800/50 py-12 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statVariants}
              className="px-6 text-center sm:text-left"
            >
              <motion.p
                className="text-2xl font-bold text-emerald-400"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.num}
              </motion.p>
              <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Districts Index */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-10"
        >
          <p className="mb-5 text-xs uppercase tracking-wider text-slate-500">
            Active Districts — Registry Index
          </p>
          <motion.div
            className="flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {districts.map((d, i) => (
              <motion.span
                key={d.name}
                custom={i}
                variants={linkVariants}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${d.active
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    : "border border-slate-700/50 bg-slate-800/30 text-slate-500 hover:text-slate-400"
                  }`}
                whileHover={{ scale: 1.05 }}
              >
                {d.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-6 border-t border-slate-800/50 py-8 sm:flex-row"
        >
          <p className="text-center text-xs text-slate-500 sm:text-left">
            &copy; {new Date().getFullYear()} LandSync ·{" "}
            <span className="text-slate-600">
              Integrated Land Management Information System
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
            <motion.div whileHover={{ x: 2 }}>
              <Link
                href="/contact"
                className="flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-emerald-400"
              >
                Terms of Registry
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ x: 2 }}>
              <Link
                href="/contact"
                className="flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-emerald-400"
              >
                Privacy Policy
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            {/* System Status Badge with Animation */}
            <motion.div
              className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5"
              animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0.1)", "0 0 0 8px rgba(16,185,129,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-emerald-400">
                Operational
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}