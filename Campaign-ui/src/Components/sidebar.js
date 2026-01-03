"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Home, Send, LayoutDashboard, Table, BarChart3, Star, Zap, CheckCircle,List } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);

  const toggleDropdown = () => setCampaignOpen(!campaignOpen);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 h-full ${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-indigo-600 to-purple-700  text-white shadow-2xl flex flex-col justify-between z-50 transition-all duration-300`}
    >
      {/* Header / Logo */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <motion.h1
            layout
            className="font-extrabold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200"
          >
            DELTA-CRM
          </motion.h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <Link href={`/`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 cursor-pointer transition-all duration-200"
          >
            <Home className="text-white" size={20} />
            {!collapsed && (
              <span className="font-medium tracking-wide">Dashboard</span>
            )}
          </motion.div>
        </Link>

        {/* Campaigns Dropdown */}
        <div>
          <div
            onClick={toggleDropdown}
            className={`flex items-center justify-between p-3 rounded-xl hover:bg-white/20 cursor-pointer transition-all duration-200 ${
              campaignOpen ? "bg-white/20" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Send className="text-white" size={20} />
              {!collapsed && (
                <span className="font-medium tracking-wide">Campaigns</span>
              )}
            </div>
            {!collapsed && (
              <motion.span
                animate={{ rotate: campaignOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/70 text-sm"
              >
                ▶
              </motion.span>
            )}
          </div>

          {/* Dropdown Content */}
          <AnimatePresence>
            {campaignOpen && !collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-9 mt-2 space-y-2"
              >
                <Link href={`/campaigns`}>
                  <DropdownItem
                    icon={<LayoutDashboard size={18} />}
                    label="Dashboard"
                  />
                </Link>
                <Link href={`/campaigns/campaign-table`}>
                  <DropdownItem icon={<Table size={18} />} label="Tables and graphs" />
                </Link>
                <Link href={`/campaigns/normal-campaign`}>
                  <DropdownItem icon={<Zap size={18} />} label="Normal Campaign" />
                </Link>
                <Link href={`/campaigns/special-campaign`}>
                  <DropdownItem icon={<Star size={18} />} label="Special Campaign" />
                </Link>
                <Link href={`/campaigns/campaign-list`}>
                  <DropdownItem icon={<List size={18} />} label="Campaign list" />
                </Link>
                <Link href={`/campaigns/manager-approval`}>
                  <DropdownItem icon={<CheckCircle size={18} />} label="Manager Approval" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-white/70 border-t border-white/20 text-center">
        {!collapsed && <p>© 2025 delta-crm</p>}
      </div>
    </motion.div>
  );
}

/* 🔹 Reusable Dropdown Sub-item */
function DropdownItem({ icon, label }) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 text-white/90"
    >
      <span className="text-white">{icon}</span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </motion.div>
  );
}
