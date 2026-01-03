"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import CampaignModal from "./CampaignModal";


export default function ReportsAndCampaignPage() {
  const { register, handleSubmit, watch, reset: resetFilters } = useForm();
  const [reports, setReports] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const getToken = () => {
    let token = localStorage.getItem("token");
    if (!token) token = localStorage.getItem("authToken");
    if (!token) token = localStorage.getItem("accessToken");
    if (!token) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          token = user.token || user.accessToken;
        } catch (e) {}
      }
    }
    return token;
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = getToken();
      const res = await fetch("http://localhost:3000/api/reports?limit=1000", {
        headers: { Authorization: `Bearer ${token}` },
      });  
      const data = await res.json();
      
      if (data.success && data.results) {
        const uniqueBranches = [];
        const branchMap = new Map();
        
        data.results.forEach((report) => {
          if (report.branch && report.branch._id) {
            if (!branchMap.has(report.branch._id)) {
              branchMap.set(report.branch._id, {
                _id: report.branch._id,
                name: report.branch.name,
                code: report.branch.code,
                city: report.branch.city,
              });
              uniqueBranches.push(branchMap.get(report.branch._id));
            }
          }
        });
        
        uniqueBranches.sort((a, b) => a.name.localeCompare(b.name));
        setBranches(uniqueBranches);
      }
    } catch (err) {
      console.error("❌ Failed to fetch branches:", err);
    }
  };

  const onFilterSubmit = async (data) => {
    try {
      setLoading(true);
      const token = getToken();
      
      const params = new URLSearchParams();
      if (data.branchId) params.append("branchId", data.branchId);
      if (data.test) params.append("test", data.test);
      if (data.gender) params.append("gender", data.gender);
      if (data.nationality) params.append("nationality", data.nationality);
      
      // Fix date handling
      if (data.startDate) {
        const startDate = new Date(data.startDate);
        params.append("startDate", startDate.toISOString());
      }
      if (data.endDate) {
        const endDate = new Date(data.endDate);
        endDate.setHours(23, 59, 59, 999);
        params.append("endDate", endDate.toISOString());
      }
      
      params.append("page", data.page || 1);
      params.append("limit", data.limit || 200);
      
      console.log("🔍 Fetching with params:", params.toString());
      
      const res = await fetch(`http://localhost:3000/api/reports?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const result = await res.json();
      console.log("📦 API Response:", result);
      
      if (result.success) {
        setReports(result.results);
        setPagination(result.pagination);
        setCurrentFilters(data);
        toast.success(`✅ Found ${result.pagination.total.toLocaleString()} reports`);
      } else {
        toast.error("Failed to fetch reports");
      }
    } catch (err) {
      console.error("❌ Error fetching reports:", err);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaignClick = () => {
    if (reports.length === 0) {
      toast.error("Please filter reports first!");
      return;
    }
    setShowCampaignModal(true);
  };

  

  return (
    <div className="min-h-screen border-1 border-gray-200 bg-gradient-to-br bg-white text-black from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            📊 Campaign Management System
          </h3>
  <p className="text-gray-600 text-lg">Filter reports and create targeted campaigns with ease</p>

</div>

        

        {/* Filter Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-indigo-100 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Filters</h2>
          </div>
          
          <form onSubmit={handleSubmit(onFilterSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Branch Filter */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 flex items-center text-sm">
                  <span className="mr-2">🏢</span> Branch
                </label>
                <select 
                  {...register("branchId")} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white hover:border-indigo-300 shadow-sm"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name} ({branch.code}) - {branch.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reservation Type */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 flex items-center text-sm">
                  <span className="mr-2">📋</span> Reservation Type
                </label>
                <select 
                  {...register("test")} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white hover:border-indigo-300 shadow-sm"
                >
                    <option value="">All Reservation</option>
                  <option value="Normal">Normal</option>
                  <option value="home visit">Home Visit</option>
                </select>
              </div>

              {/* Gender */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 flex items-center text-sm">
                  <span className="mr-2">👤</span> Gender
                </label>
                <select 
                  {...register("gender")} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white hover:border-indigo-300 shadow-sm"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Nationality */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 flex items-center text-sm">
                  <span className="mr-2">🌍</span> Nationality
                </label>
                <select 
                  {...register("nationality")} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white hover:border-indigo-300 shadow-sm"
                >
                  <option value="">All Nationalities</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 flex items-center text-sm">
                  <span className="mr-2">📅</span> From Date
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-indigo-300 shadow-sm"
                />
              </div>

              {/* End Date */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 flex items-center text-sm">
                  <span className="mr-2">📅</span> To Date
                </label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-indigo-300 shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Reports
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setReports([]);
                  setPagination(null);
                }}
                className="bg-gradient-to-r cursor-pointer from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear All
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Reports Table */}
        {reports.length > 0 && (
          <>
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-indigo-100">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 p-2.5 rounded-xl mr-3 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    Filtered Reports
                  </h2>
                  {pagination && (
                    <p className="mt-2 ml-14">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {pagination.total.toLocaleString()} records found
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border-2 border-gray-100 shadow-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">#</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Order ID</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Patient Name</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Type</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Branch</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Gender</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Mobile</th>
                      <th className="p-4 text-left font-bold text-sm uppercase tracking-wider">Booking Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr
                        key={r._id}
                        className={`border-b border-gray-100 ${
                          i % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-gray-50 to-blue-50"
                        } hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200`}
                      >
                        <td className="p-4 text-sm text-gray-700 font-semibold">{i + 1}</td>
                        <td className="p-4 text-gray-800 font-bold">{r.OrderId || "N/A"}</td>
                        <td className="p-4 text-gray-900 font-medium">{r.PatientName}</td>
                        <td className="p-4">
                          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                            {r.ReservationType}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{r.branch?.name || "N/A"}</span>
                            <span className="text-xs text-gray-500">{r.branch?.city}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            r.Gender === 'Male' 
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' 
                              : 'bg-gradient-to-r from-pink-400 to-pink-600 text-white'
                          }`}>
                            {r.Gender === 'Male' ? '👨' : '👩'} {r.Gender}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700 font-mono font-semibold">{r.MobileNo}</td>
                        <td className="p-4 text-gray-600 font-medium">
                          {r.BookingTime ? new Date(r.BookingTime).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info */}
              {pagination && (
                <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 rounded-2xl flex flex-wrap justify-between items-center gap-4 border border-gray-200">
                  <span className="text-gray-700 font-semibold">
                    Showing <span className="font-bold text-indigo-600 text-lg">{reports.length}</span> of{" "}
                    <span className="font-bold text-indigo-600 text-lg">{pagination.total.toLocaleString()}</span> records
                    <span className="text-gray-500 ml-2 text-sm">
                      (Page {pagination.page} of {pagination.totalPages})
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Create Campaign Button */}
            <div className="text-center py-8">
              <button
                onClick={handleCreateCampaignClick}
                className="group bg-gradient-to-r cursor-pointer from-green-500 via-emerald-500 to-teal-500 text-white px-12 py-3 rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 font-bold text-xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-green-500/50 border-2 border-green-400"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-8 h-8 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Create Campaign for {pagination?.total.toLocaleString()} Records
                </span>
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <div className="bg-white p-16 rounded-3xl shadow-2xl border-2 border-dashed border-indigo-300 text-center">
            <div className="text-8xl mb-6 animate-bounce">🔍</div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
              No Reports Found
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Apply filters above to search for reports and create targeted campaigns
            </p>
            <div className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg border-2 border-indigo-200">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-indigo-900 font-semibold">Start by selecting filters and clicking Search Reports</span>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      {showCampaignModal && (
        <CampaignModal
          currentFilters={currentFilters}
          totalRecords={pagination?.total || 0}
          onClose={() => setShowCampaignModal(false)}
        />
      )}
    </div>
  );
}
