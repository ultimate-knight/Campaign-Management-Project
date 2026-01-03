"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Clock, MoreVertical, ArrowLeft, Calendar, DollarSign, MapPin } from "lucide-react";
import Sidebar from "@/Components/sidebar";

export default function ManagerApprovalPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchSelections, setBranchSelections] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "details"

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/special-campaigns?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const viewCampaignDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setViewMode("details");
    setOpenMenuId(null);

    // Initialize branch selections with current status
    const selections = {};
    campaign.branches.forEach((branch) => {
      const branchId = branch._id;
      selections[branchId] =
        campaign.branchApprovalStatus?.[branchId] || "pending";
    });
    setBranchSelections(selections);
  };

  const backToList = () => {
    setViewMode("list");
    setSelectedCampaign(null);
    setBranchSelections({});
  };

  const handleBranchStatusChange = (branchId, status) => {
    setBranchSelections((prev) => ({
      ...prev,
      [branchId]: status,
    }));
  };

  const submitApproval = async () => {
    try {
      const token = getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/special-campaigns/${selectedCampaign._id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            branchApprovals: branchSelections,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Campaign approval status updated!");
        backToList();
        fetchCampaigns();
      } else {
        toast.error(data.message || "Failed to update approval");
      }
    } catch (err) {
      console.error("Error submitting approval:", err);
      toast.error("Failed to submit approval");
    }
  };

  const getStatusCounts = () => {
    const approved = Object.values(branchSelections).filter((s) => s === "approved").length;
    const rejected = Object.values(branchSelections).filter((s) => s === "rejected").length;
    const pending = Object.values(branchSelections).filter((s) => s === "pending").length;
    return { approved, rejected, pending };
  };

  const toggleMenu = (campaignId) => {
    setOpenMenuId(openMenuId === campaignId ? null : campaignId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

  if (viewMode === "details" && selectedCampaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <Sidebar />
        <div className="ml-64">
          {/* Back Button */}
          <button
            onClick={backToList}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Campaigns
          </button>

          {/* Campaign Details Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {selectedCampaign.name}
                </h1>
                <p className="text-gray-600">Campaign Details & Branch Approval</p>
              </div>
              <div className="bg-yellow-100 rounded-xl px-4 py-2">
                <p className="text-yellow-800 font-semibold">Pending Review</p>
              </div>
            </div>

            {/* Campaign Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-blue-600" size={24} />
                  <p className="text-gray-600 font-medium">Target Amount</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  ${selectedCampaign.targetAmount?.toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-green-600" size={24} />
                  <p className="text-gray-600 font-medium">Start Date</p>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {new Date(selectedCampaign.startDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-purple-600" size={24} />
                  <p className="text-gray-600 font-medium">End Date</p>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {new Date(selectedCampaign.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-orange-600" size={24} />
                  <p className="text-gray-600 font-medium">Total Branches</p>
                </div>
                <p className="text-3xl font-bold text-orange-600">
                  {selectedCampaign.branches?.length || 0}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 font-medium mb-1">Daily Report Required</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedCampaign.dailyReport ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium mb-1">Campaign Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedCampaign.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Approval Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Branch Approval Management
            </h2>

            {/* Status Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <p className="font-semibold text-gray-800 mb-3">Decision Summary:</p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-600 font-bold text-lg">
                    Approved: {getStatusCounts().approved}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="text-red-600" size={20} />
                  <span className="text-red-600 font-bold text-lg">
                    Rejected: {getStatusCounts().rejected}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-yellow-600" size={20} />
                  <span className="text-yellow-600 font-bold text-lg">
                    Pending: {getStatusCounts().pending}
                  </span>
                </div>
              </div>
            </div>

            {/* Branches Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Branch Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">City</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Current Status</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCampaign.branches?.map((branch, index) => (
                    <tr
                      key={branch._id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">{branch.name}</td>
                      <td className="p-4 text-gray-600">{branch.city}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                            branchSelections[branch._id] === "approved"
                              ? "bg-green-100 text-green-700"
                              : branchSelections[branch._id] === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {branchSelections[branch._id] === "approved" && (
                            <CheckCircle size={16} />
                          )}
                          {branchSelections[branch._id] === "rejected" && (
                            <XCircle size={16} />
                          )}
                          {branchSelections[branch._id] === "pending" && (
                            <Clock size={16} />
                          )}
                          {branchSelections[branch._id]}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleBranchStatusChange(branch._id, "approved")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              branchSelections[branch._id] === "approved"
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
                          >
                            <CheckCircle size={18} className="inline mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleBranchStatusChange(branch._id, "rejected")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              branchSelections[branch._id] === "rejected"
                                ? "bg-red-600 text-white shadow-lg"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            <XCircle size={18} className="inline mr-1" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleBranchStatusChange(branch._id, "pending")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              branchSelections[branch._id] === "pending"
                                ? "bg-yellow-600 text-white shadow-lg"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            <Clock size={18} className="inline mr-1" />
                            Pending
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={submitApproval}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
              >
                Submit Decision
              </button>
              <button
                onClick={backToList}
                className="bg-gray-200 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-300 font-semibold text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <Sidebar />
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manager Approval Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Review and approve special campaign requests</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-semibold">Pending Approvals</p>
              <p className="text-3xl font-bold text-blue-600">{campaigns.length}</p>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending campaigns to review at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="text-left p-4 font-semibold">Campaign Name</th>
                    <th className="text-left p-4 font-semibold">Target Amount</th>
                    <th className="text-left p-4 font-semibold">Start Date</th>
                    <th className="text-left p-4 font-semibold">End Date</th>
                    <th className="text-center p-4 font-semibold">Branches</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr
                      key={campaign._id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-semibold text-gray-800">{campaign.name}</td>
                      <td className="p-4 text-blue-600 font-semibold">
                        ${campaign.targetAmount?.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {campaign.branches?.length || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(campaign._id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                          <MoreVertical size={20} className="text-yellow-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === campaign._id && (
                          <div className="absolute right-4 top-12 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-10 min-w-[160px]">
                            <button
                              onClick={() => viewCampaignDetails(campaign)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors font-medium text-gray-700 rounded-lg"
                            >
                              View Details
                            </button>
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
      </div>
    </div>
  );
}