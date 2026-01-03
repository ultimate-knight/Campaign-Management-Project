
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createCampaign } from "@/app/lib/api";
import { toast } from "react-hot-toast";


export default function CampaignModal({ currentFilters, totalRecords, onClose }) {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("❌ No authentication token found");
        return;
      }

      const createdBy = "68f10ce0cb83b0f8c7a76e04";

      const queryObj = {};
      if (currentFilters.branchId) queryObj.branch = currentFilters.branchId;
      if (currentFilters.test) queryObj.ReservationType = { $regex: currentFilters.test, $options: "i" };
      if (currentFilters.gender) queryObj.Gender = currentFilters.gender;
      if (currentFilters.nationality) queryObj.Nationality = currentFilters.nationality;
      if (currentFilters.startDate && currentFilters.endDate) {
        queryObj.BookingTime = {
          $gte: new Date(currentFilters.startDate),
          $lte: new Date(new Date(currentFilters.endDate).setHours(23, 59, 59, 999)),
        };
      }

      const payload = {
        name: data.name,
        createdBy,
        provider: data.provider,
        communicationType: data.communicationType || "sms",
        message: data.message,
        startDate: data.campaignStartDate,
        endDate: data.campaignEndDate,
        status: data.campaignStatus || "active",
        totalRecords: totalRecords,
        metaData: {
          query: JSON.stringify(queryObj),
          communication: { type: data.communicationType || "sms" },
          totalRecords: totalRecords,
          updatedRecords: 0,
        },
      };

      const res = await createCampaign(payload, token);

      if (res.success) {
        toast.success(`✅ Campaign created! Will process ${totalRecords.toLocaleString()} records.`);
        onClose();
      } else {
        toast.error(res.message || "⚠️ Failed to create campaign");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(err.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 rounded-t-3xl border-b-4 border-green-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-2xl mr-4 shadow-lg">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Create New Campaign</h2>
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
          {/* Applied Filters */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-inner">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {/* ...existing code... */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 01-2 2" />
              </svg>
              Applied Filters
            </h4>

            <div className="text-sm text-indigo-800 space-y-1">
              {currentFilters.branchId && <p>✓ Branch: {currentFilters.branchId}</p>}
              {currentFilters.test && <p>✓ Type: {currentFilters.test}</p>}
              {currentFilters.gender && <p>✓ Gender: {currentFilters.gender}</p>}
              {currentFilters.nationality && <p>✓ Nationality: {currentFilters.nationality}</p>}
              {currentFilters.startDate && <p>✓ From: {currentFilters.startDate}</p>}
              {currentFilters.endDate && <p>✓ To: {currentFilters.endDate}</p>}
              <p className="font-bold text-green-700 mt-2">🎯 Total Records: {totalRecords.toLocaleString()}</p>
            </div>
          </div>

          {/* Campaign Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Campaign Name *</label>
              <input
                {...register("name", { required: true })}
                placeholder="Enter campaign name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Provider *</label>
              <select
                {...register("provider", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Select Provider</option>
                <option value="Saudi-Mshastra">Saudi Mshastra</option>
                <option value="Msegat-communication">Msegat communication</option>
                {/* <option value="sendgrid">SendGrid</option> */}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Communication Type *</label>
              <select
                {...register("communicationType", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Campaign Status</label>
              <select
                {...register("campaignStatus")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="active">Active</option>
                <option value="queued">Queued</option>
                <option value="inactive">Inactive</option>
                <option value="processing">Processing</option>
                <option value="done">Done</option>
                <option value="failed">Failed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Message Template *</label>
            <textarea
              {...register("message", { required: true })}
              placeholder="Message Template: Hi {{PatientName}}, your report is ready."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Campaign Start *</label>
              <input
                type="date"
                {...register("campaignStartDate", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Campaign End *</label>
              <input
                type="date"
                {...register("campaignEndDate", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 font-bold"
            >
              {loading ? "Creating..." : `Create Campaign (${totalRecords.toLocaleString()} records)`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

