import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message || "⚠️ Failed to create special campaign");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(err.message || "Failed to create special campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 text-black bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-6 rounded-t-3xl border-b-4 border-purple-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-2xl mr-4 shadow-lg">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Create Special Campaign</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
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
  );
}
