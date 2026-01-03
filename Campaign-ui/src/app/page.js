"use client";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "@/Components/sidebar";
import Searchbar from "@/Components/search-bar";
import ReportsAndCampaignPage from "@/Components/ReportandCampaign";
import { getReports } from "@/app/lib/api";

export default function HomePage() {

  return (
    <div className="flex min-h-screen min-w-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-20 md:ml-60 p-8 transition-all duration-300">
        <Toaster />

        {/* Searchbar */}
        <Searchbar />

      

        <ReportsAndCampaignPage/>

      </div>
    </div>
  );
}
