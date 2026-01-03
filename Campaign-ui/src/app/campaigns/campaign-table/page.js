"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Sidebar from "@/Components/sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Info } from "lucide-react"; // optional icon library

const statusBadgeStyle = {
  active: "bg-green-100 text-green-800 border-green-400",
  inactive: "bg-gray-100 text-gray-800 border-gray-300",
  archived: "bg-yellow-100 text-yellow-800 border-yellow-400",
  queued: "bg-orange-100 text-orange-800 border-orange-400",
  processing: "bg-blue-100 text-blue-800 border-blue-400",
  done: "bg-emerald-100 text-emerald-800 border-emerald-400",
  failed: "bg-red-100 text-red-800 border-red-400",
};

export default function CampaignTableAndGraph() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api";

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("❌ No authentication token found.");
        return;
      }

      const res = await fetch(`${API_BASE}/campaign/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      setCampaigns(data.result || []);
    } catch (err) {
      console.error("❌ Error fetching campaigns:", err);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Chart data
  const chartData = useMemo(() => {
    const daily = {};
    campaigns.forEach((c) => {
      const d = c.createdAt
        ? new Date(c.createdAt).toISOString().split("T")[0]
        : null;
      if (d) daily[d] = (daily[d] || 0) + 1;
    });

    return Object.keys(daily)
      .sort((a, b) => a.localeCompare(b))
      .map((date) => ({ date, count: daily[date] }));
  }, [campaigns]);

  // 👉 Handler when clicking Info button
  const handleInfoClick = (id) => {
    router.push(`/campaigns/${id}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-gray-900">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow">
              Campaigns Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Insights and performance summary
            </p>
          </div>
          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className={`mt-4 sm:mt-0 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            } px-5 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105`}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Graph Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span className="bg-indigo-500 w-2 h-2 rounded-full mr-2"></span>
            Campaigns Created (By Day)
          </h3>

          {chartData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8f8ff",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 italic">
              No creation data available yet
            </p>
          )}
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="bg-purple-500 w-2 h-2 rounded-full mr-2"></span>
            Recent Campaigns
          </h3>

          {loading ? (
            <div className="text-center py-8 text-gray-500 italic">
              Loading campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              No campaigns found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 uppercase text-sm font-semibold tracking-wide">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Provider</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-center">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr
                      key={c._id}
                      className={`border-t ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-purple-50 transition-all duration-150`}
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {c.name}
                      </td>
                      <td className="p-3 text-gray-700">{c.provider}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 border rounded-full text-xs font-semibold ${
                            statusBadgeStyle[c.status] ||
                            "bg-gray-100 text-gray-800 border-gray-300"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        {c.communicationType || "-"}
                      </td>
                      <td className="p-3 text-gray-500 text-sm">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      {/* ℹ️ Info Button */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleInfoClick(c._id)}
                          className="text-indigo-600 hover:text-purple-600 transition-transform transform hover:scale-110"
                          title="View Campaign Details"
                        >
                          <Info className="inline-block w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
