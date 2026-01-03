"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Searchbar({ placeholder = "Search reports, campaigns..." }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full sm:w-1/2 mx-auto mb-6"
    >
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white/70 backdrop-blur-md border border-gray-200 rounded-full px-5 py-3 pl-12 text-gray-700 shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
        />
        <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
      </div>
    </motion.div>
  );
}
