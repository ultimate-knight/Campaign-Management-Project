"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/Components/sidebar";
import { getCampaignDetail } from "@/app/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (!id) return;
    getCampaignDetail(id)
      .then((res) => {
        console.log("📦 Campaign Detail Response:", res);
        setCampaign(res);
      })
      .catch(() => toast.error("Failed to fetch campaign details"));
  }, [id]);

  if (!campaign)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-gray-700">
        <div className="animate-pulse text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Loading Campaign Details...
          </h1>
          <p className="mt-2 text-gray-500">Please wait a moment ⏳</p>
        </div>
      </div>
    );

  const {
    name,
    provider,
    status,
    startDate,
    endDate,
    message,
    result,
    createdAt,
  } = campaign;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-5 text-gray-800">
        <Sidebar/>
      {/* Header */}
      <div className="mb-8 ml-65">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent drop-shadow">
          {name}
        </h1>
      </div>

      {/* Campaign Overview */}
      <div className="ml-65">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-gray-100"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
          <span className="bg-indigo-500 w-2 h-2 rounded-full mr-2"></span>
          Campaign Overview
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm">
          <InfoCard label="Provider" value={provider} icon="📨" />
          <InfoCard
            label="Status"
            value={status}
            color={
              status === "active"
                ? "text-green-600"
                : status === "failed"
                ? "text-red-600"
                : "text-gray-600"
            }
            icon="📈"
          />
          <InfoCard
            label="Start Date"
            value={new Date(startDate).toLocaleDateString()}
            icon="📅"
          />
          <InfoCard
            label="End Date"
            value={new Date(endDate).toLocaleDateString()}
            icon="⏰"
          />
          <InfoCard
            label="Created On"
            value={new Date(createdAt).toLocaleString()}
            icon="🕒"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Message Template
          </h3>
          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 p-4 rounded-lg text-sm leading-relaxed shadow-inner">
            {message || "No message content available."}
          </div>
        </div>
      </motion.div>

      {/* Targeted Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
          <span className="bg-purple-500 w-2 h-2 rounded-full mr-2"></span>
          Targeted Users
        </h2>

        {!result || result.length === 0 ? (
          <div className="text-center text-gray-500 italic py-8">
            No targeted user data available.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 text-sm uppercase font-semibold tracking-wide">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Nationality</th>
                  {/* <th className="p-3 text-left">Message</th> */}
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => (
                  <tr
                    key={i}
                    className={`border-t ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-purple-50 transition-all duration-150`}
                  >
                    <td className="p-3 text-sm font-medium text-gray-800">
                      {r.userData?.name || "N/A"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {r.userData?.mobileNo || "-"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {r.userData?.gender || "-"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {r.userData?.nationality || "-"}
                    </td>
                    {/* <td className="p-3 text-xs text-gray-600">
                      {r.userData?.message || "-"}
                    </td> */}
                    <td className="p-3">
                      <StatusBadge status={r.communicationStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}

/* 💠 Info Card (Overview Item) */
function InfoCard({ label, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-white to-indigo-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center mb-1 text-gray-500 text-xs uppercase tracking-wide font-semibold">
        <span className="mr-1">{icon}</span> {label}
      </div>
      <div className={`text-sm font-bold ${color || "text-gray-700"}`}>
        {value || "-"}
      </div>
    </motion.div>
  );
}

/* 🟢 Status Badge Component */
function StatusBadge({ status }) {
  const styles = {
    sent: "bg-green-100 text-green-700 border-green-400",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
    failed: "bg-red-100 text-red-700 border-red-400",
    default: "bg-gray-100 text-gray-700 border-gray-300",
  };

  const badgeStyle = styles[status] || styles.default;

  return (
    <span
      className={`px-3 py-1 border rounded-full text-xs font-semibold ${badgeStyle}`}
    >
      {status || "new"}
    </span>
  );
}
