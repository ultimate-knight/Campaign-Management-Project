// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import SpecialCampaignModal from "@/Components/SpecialCampaignModal";
// import Sidebar from "@/Components/sidebar";
// import { Filter, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";

// export default function SpecialCampaignPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(null); // Track which campaign's filter is open
//   const [branches, setBranches] = useState([]);

//   const getToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) token = localStorage.getItem("authToken");
//     if (!token) token = localStorage.getItem("accessToken");
//     if (!token) {
//       const userStr = localStorage.getItem("user");
//       if (userStr) {
//         try {
//           const user = JSON.parse(userStr);
//           token = user.token || user.accessToken;
//         } catch (e) {}
//       }
//     }
//     return token;
//   };

//   const fetchCampaigns = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/special-campaigns`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setCampaigns(data.campaigns || []);
//       }
//     } catch (err) {
//       console.error("Error fetching campaigns:", err);
//       toast.error("Failed to load campaigns");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const token = getToken();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/branches`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setBranches(data.branches || []);
//       }
//     } catch (err) {
//       console.error("Error fetching branches:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCampaigns();
//     fetchBranches();
//   }, []);

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock size={16} /> },
//       approved: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle size={16} /> },
//       rejected: { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={16} /> },
//       partial: { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock size={16} /> },
//     };
    
//     const config = statusConfig[status] || statusConfig.pending;
    
//     return (
//       <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text} font-semibold`}>
//         {config.icon}
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };


//   const getBranchNames = (branchItems, approvalStatus) => {
//   if (!branchItems || branchItems.length === 0) return "No branches";

//   return branchItems.map(item => {
//     const branch = typeof item === "object" ? item : branches.find(b => b._id === item);
//     const id = branch?._id || item;
//     const branchStatus = approvalStatus?.[id] || "pending";

//     // const statusEmoji = {
//     //   approved: "✅",
//     //   rejected: "❌",
//     //   pending: "⏳",
//     // }[branchStatus] || "⏳";

//     const statusEmoji = {
//   approved: "[✓]",
//   rejected: "[✕]",
//   pending: "[ ]",
// }[branchStatus] || "[ ]";

//     return branch ? `${statusEmoji} ${branch.name}` : id;
//   }).join(", ");
// };

//   return (
//     <div className="min-h-screen text-black bg-gradient-to-br from-purple-50 via-pink-50 to-white p-6 ml-64">
//       <Sidebar />
//       {/* Header */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Special Campaigns
//             </h1>
//             <p className="text-gray-600 mt-2">Create and manage special campaigns for multiple branches</p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Create Special Campaign
//           </button>
//         </div>
//       </div>

//       {/* Campaigns List */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//             <p className="text-gray-600 mt-4">Loading campaigns...</p>
//           </div>
//         ) : campaigns.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//               <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No Special Campaigns Yet</h3>
//             <p className="text-gray-600">Create your first special campaign to get started!</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b-2 border-purple-200">
//                   <th className="text-left p-4 font-semibold text-gray-700">Campaign Name</th>
//                   <th className="text-left p-4 font-semibold text-gray-700">Target Amount</th>
//                   <th className="text-left p-4 font-semibold text-gray-700">Date Range</th>
//                   <th className="text-left p-4 font-semibold text-gray-700">Daily Report</th>
//                   <th className="text-left p-4 font-semibold text-gray-700">Branches</th>
//                   <th className="text-left p-4 font-semibold text-gray-700">Status</th>
//                   <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {campaigns.map((campaign) => (
//                   <tr key={campaign._id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
//                     <td className="p-4">
//                       <div className="font-semibold text-gray-800">{campaign.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(campaign.createdAt).toLocaleDateString()}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <span className="font-bold text-purple-600">
//                         ${campaign.targetAmount?.toLocaleString() || 0}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-sm">
//                         <div className="text-gray-600">
//                           {new Date(campaign.startDate).toLocaleDateString()}
//                         </div>
//                         <div className="text-gray-400 text-xs">to</div>
//                         <div className="text-gray-600">
//                           {new Date(campaign.endDate).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                         campaign.dailyReport 
//                           ? "bg-green-100 text-green-800" 
//                           : "bg-gray-100 text-gray-800"
//                       }`}>
//                         {campaign.dailyReport ? "Yes" : "No"}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-sm text-gray-700 max-w-xs">
//                         {getBranchNames(campaign.branches, campaign.branchApprovalStatus)}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       {getStatusBadge(campaign.status)}
//                     </td>
//                     <td className="p-4">
//                       {campaign.status === "approved" && (
//                         <div className="relative">
//                           <button
//                             onClick={() => setShowFilters(showFilters === campaign._id ? null : campaign._id)}
//                             className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
//                           >
//                             <MoreVertical size={20} className="text-gray-600" />
//                           </button>
                          
//                           {showFilters === campaign._id && (
//                             <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border-2 border-purple-200 z-10 p-4">
//                               <div className="flex items-center justify-between mb-3">
//                                 <h4 className="font-bold text-gray-800 flex items-center gap-2">
//                                   <Filter size={16} />
//                                   Filters
//                                 </h4>
//                                 <button
//                                   onClick={() => setShowFilters(null)}
//                                   className="text-gray-500 hover:text-gray-700"
//                                 >
//                                   ✕
//                                 </button>
//                               </div>
                              
//                               <div className="space-y-3">
//                                 <div>
//                                   <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                                     Branches (Pre-selected)
//                                   </label>
//                                   <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-lg">
//                                     {campaign.branches?.map(branchId => {
//                                       const branch = branches.find(b => b._id === branchId);
//                                       const isApproved = campaign.branchApprovalStatus?.[branchId] === "approved";
                                      
//                                       return branch && isApproved ? (
//                                         <div key={branchId} className="flex items-center gap-2 text-sm text-gray-600">
//                                           <input
//                                             type="checkbox"
//                                             checked={true}
//                                             disabled={true}
//                                             className="w-4 h-4 text-purple-600 rounded"
//                                           />
//                                           <span>{branch.name}</span>
//                                         </div>
//                                       ) : null;
//                                     })}
//                                   </div>
//                                 </div>
                                
//                                 <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
//                                   Apply Filters
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <SpecialCampaignModal
//           onClose={() => setShowModal(false)}
//           onSuccess={fetchCampaigns}
//         />
//       )}
//     </div>
//   );
// }










"use client"
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Sidebar from "@/Components/sidebar";
import { toast } from "react-hot-toast";

export default function SpecialCampaignModal({ onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);

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

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // const token = getToken();
        // const response = await fetch("http://localhost:3000/api/branches", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setBranches(data.branches || []);
        // }

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
        console.error("Error fetching branches:", err);
        toast.error("Failed to load branches");
      }
    };
    fetchBranches();
  }, []);

  const handleBranchToggle = (branchId) => {
    setSelectedBranches(prev => 
      prev.includes(branchId) 
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const onSubmit = async (data) => {
    try {
      if (selectedBranches.length === 0) {
        toast.error("Please select at least one branch");
        return;
      }

      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("❌ No authentication token found");
        return;
      }

      const payload = {
        name: data.name,
        targetAmount: parseFloat(data.targetAmount),
        startDate: data.startDate,
        endDate: data.endDate,
        dailyReport: data.dailyReport === "true",
        branches: selectedBranches,
        campaignType: "special",
        status: "pending", // Pending manager approval
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/special-campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

    if (result.success) {
  toast.success("✅ Special campaign created! Waiting for manager approval.");
  window.location.href = "/campaigns/campaign-list";
}
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(err.message || "Failed to create special campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen min-w-screen text-black bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
      <div className="bg-white shadow-2xl text-black min-w-screen min-h-screen overflow-y-auto animate-slideUp">
        <Sidebar/>
        {/* Modal Header */}
        <div className="">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 min-w-screen  p-6 border-b-4 border-purple-600">
          <div className="flex justify-between items-center ml-64">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-2xl mr-4 shadow-lg">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Create Special Campaign</h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 ml-64">
          {/* Campaign Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Campaign Name *</label>
            <input
              {...register("name", { required: "Campaign name is required" })}
              placeholder="Enter campaign name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Target Amount */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Target Amount *</label>
            <input
              type="number"
              step="0.01"
              {...register("targetAmount", { 
                required: "Target amount is required",
                min: { value: 0, message: "Amount must be positive" }
              })}
              placeholder="Enter target amount"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
            {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount.message}</p>}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Start Date *</label>
              <input
                type="date"
                {...register("startDate", { required: "Start date is required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">End Date *</label>
              <input
                type="date"
                {...register("endDate", { required: "End date is required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Daily Report */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Daily Report *</label>
            <select
              {...register("dailyReport", { required: "Please select daily report option" })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            >
              <option value="">Select Option</option>
              <option value="true">Yes, Send Daily Report</option>
              <option value="false">No Daily Report</option>
            </select>
            {errors.dailyReport && <p className="text-red-500 text-sm mt-1">{errors.dailyReport.message}</p>}
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Select Branches *</label>
            <div className="border-2 border-gray-200 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2">
              {branches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Loading branches...</p>
              ) : (
                branches.map((branch) => (
                  <label
                    key={branch._id}
                    className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes(branch._id)}
                      onChange={() => handleBranchToggle(branch._id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{branch.name}</p>
                      <p className="text-sm text-gray-500">{branch.city} - {branch.code}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selectedBranches.length === 0 && (
              <p className="text-amber-600 text-sm mt-2">⚠️ Please select at least one branch</p>
            )}
          </div>

          {/* Selected Branches Count */}
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-purple-800 font-medium">
              ✓ Selected Branches: <span className="font-bold">{selectedBranches.length}</span>
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || selectedBranches.length === 0}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 disabled:bg-gray-400 font-bold transition-colors"
            >
              {loading ? "Creating..." : "Submit for Approval"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      </div>
    // </div>
  );
}
