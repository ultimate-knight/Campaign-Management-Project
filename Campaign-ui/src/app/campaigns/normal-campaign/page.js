"use client";
import Sidebar from "@/Components/sidebar";
export default function NormalCampaignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6">
      <Sidebar />
      <div className="ml-64">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Normal Campaign</h1>
        <p className="text-gray-600 text-lg">
          This feature is coming soon. We'll discuss the implementation later.
        </p>
      </div>
    </div>
    </div>
  );
}
