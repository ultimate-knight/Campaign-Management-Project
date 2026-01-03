import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api";

export const getReports = async (filters) => {
  const params = new URLSearchParams();

  if (filters.branchId) params.append("branchId", filters.branchId);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.test) params.append("test", filters.test);

  const res = await axios.get(`${API_BASE}/reports?${params.toString()}`);
  return res.data.results || res.data.result || [];
};

export async function createCampaign(payload, token) {
  if (!token) {
    console.error("❌ No token provided");
    throw new Error("No token found.");
  }

  console.log("🚀 Creating campaign with:");
  console.log("📍 URL:", `${API_BASE}/campaign`);
  console.log("🔑 Token (first 20 chars):", token.substring(0, 20) + "...");
  console.log("📦 Payload:", payload);

  try {
    const response = await fetch(`${API_BASE}/campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);
    console.log("Response OK:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);
    
    if (!response.ok) {
      console.error("API Error Response:", data);
      throw new Error(data.message || `API Error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

export const getCampaigns = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_BASE}/campaign/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getCampaignDetail = async (id) => {
  const res = await axios.get(`${API_BASE}/campaign/${id}`);
  return res.data.campaign;
};

export const updateCampaignStatus = async (id, status) => {
  const res = await axios.put(`${API_BASE}/campaign/${id}/status`, { status });
  return res.data;
};