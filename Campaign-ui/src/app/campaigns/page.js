"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "@/Components/sidebar";
import toast from "react-hot-toast";

export default function CampaignDashboardFormal() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api";

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const res = await fetch(`${API_BASE}/campaign/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed");
      setCampaigns(data.result || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchCampaigns();
    const handler = () => fetchCampaigns();
    window.addEventListener("campaignCreated", handler);
    return () => window.removeEventListener("campaignCreated", handler);
  }, [fetchCampaigns]);

  const aggregates = useMemo(() => {
    const agg = {
      total: 0,
      active: 0,
      inactive: 0,
      archived: 0,
      queued: 0,
      processing: 0,
      done: 0,
      failed: 0,
    };

    campaigns.forEach((c) => {
      agg.total += 1;
      const st = (c.status || "").toLowerCase();
      if (agg[st] !== undefined) agg[st] += 1;
    });

    return { agg };
  }, [campaigns]);

  return (
    <div className="flex min-h-screen min-w-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 ml-20 md:ml-64 px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            
            <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
  Campaign Dashboard
</h1>
            <p className="text-gray-600 mt-1">
              Overview of your campaign performance
            </p>
          </div>

          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } px-5 py-2 rounded-md font-medium shadow transition duration-200`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Total" value={aggregates.agg.total} color="bg-gray-700" icon="📊" />
          <StatCard label="Active" value={aggregates.agg.active} color="bg-green-600" icon="✅" />
          <StatCard label="Inactive" value={aggregates.agg.inactive} color="bg-gray-500" icon="⏸" />
          <StatCard label="Archived" value={aggregates.agg.archived} color="bg-yellow-600" icon="🗄" />
          <StatCard label="Queued" value={aggregates.agg.queued} color="bg-orange-500" icon="⏳" />
          <StatCard label="Processing" value={aggregates.agg.processing} color="bg-blue-500" icon="⚙️" />
          <StatCard label="Done" value={aggregates.agg.done} color="bg-green-700" icon="✔️" />
          <StatCard label="Failed" value={aggregates.agg.failed} color="bg-red-600" icon="❌" />
        </div>
      </main>
    </div>
  );
}

/* Formal Stat Card */
function StatCard({ label, value, color, icon }) {
  return (
    <div
      className={`${color} text-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center transition-transform transform hover:scale-105`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm uppercase font-medium">{label}</div>
      <div className="text-2xl font-bold mt-1">{value ?? 0}</div>
    </div>
  );
}
