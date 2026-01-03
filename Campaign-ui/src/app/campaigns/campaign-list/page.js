"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SpecialCampaignModal from "@/Components/SpecialCampaignModal";
import Sidebar from "@/Components/sidebar";
import { Filter, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";

export default function SpecialCampaignPage() {
  const [showModal, setShowModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(null); // Track which campaign's filter is open
  const [branches, setBranches] = useState([]);

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

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/special-campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBranches(data.branches || []);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchBranches();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock size={16} /> },
      approved: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle size={16} /> },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={16} /> },
      partial: { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock size={16} /> },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text} font-semibold`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  const getBranchNames = (branchItems, approvalStatus) => {
  if (!branchItems || branchItems.length === 0) return "No branches";

  return branchItems.map(item => {
    const branch = typeof item === "object" ? item : branches.find(b => b._id === item);
    const id = branch?._id || item;
    const branchStatus = approvalStatus?.[id] || "pending";

   

    const statusEmoji = {
  approved: "[✓]",
  rejected: "[✕]",
  pending: "[ ]",
}[branchStatus] || "[ ]";

    return branch ? `${statusEmoji} ${branch.name}` : id;
  }).join(", ");
};

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-purple-50 via-pink-50 to-white p-6">
      <Sidebar />
      {/* Header */}
      <div className="ml-64">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              List of all Campaigns
            </h1>
            <p className="text-gray-600 mt-2">Manage list of campaigns</p>
          </div>
         
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Special Campaigns Yet</h3>
            <p className="text-gray-600">Create your first special campaign to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-200">
                  <th className="text-left p-4 font-semibold text-gray-700">Campaign Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Target Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date Range</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Daily Report</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Branches</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{campaign.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-purple-600">
                        ${campaign.targetAmount?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-gray-600">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 text-xs">to</div>
                        <div className="text-gray-600">
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        campaign.dailyReport 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {campaign.dailyReport ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {getBranchNames(campaign.branches, campaign.branchApprovalStatus)}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="p-4">
                      {campaign.status === "approved" && (
                        <div className="relative">
                          <button
                            onClick={() => setShowFilters(showFilters === campaign._id ? null : campaign._id)}
                            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={20} className="text-gray-600" />
                          </button>
                          
                          {showFilters === campaign._id && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border-2 border-purple-200 z-10 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                  <Filter size={16} />
                                  Filters
                                </h4>
                                <button
                                  onClick={() => setShowFilters(null)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ✕
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                    Branches (Pre-selected)
                                  </label>
                                  <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-lg">
                                    {campaign.branches?.map(branchId => {
                                      const branch = branches.find(b => b._id === branchId);
                                      const isApproved = campaign.branchApprovalStatus?.[branchId] === "approved";
                                      
                                      return branch && isApproved ? (
                                        <div key={branchId} className="flex items-center gap-2 text-sm text-gray-600">
                                          <input
                                            type="checkbox"
                                            checked={true}
                                            disabled={true}
                                            className="w-4 h-4 text-purple-600 rounded"
                                          />
                                          <span>{branch.name}</span>
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                                
                                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                                  Apply Filters
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <SpecialCampaignModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchCampaigns}
        />
      )}
    </div>
    </div>
  );
}
