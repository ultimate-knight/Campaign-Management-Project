const mongoose = require("mongoose");

const specialCampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    dailyReport: { type: Boolean, default: false },
    
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
    
    // Track approval status per branch
    branchApprovalStatus: {
      type: Map, 
      of: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },
      default: {}
    },
    
    // Overall status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "partial"],
      default: "pending",
    },
    
    campaignType: {
      type: String,
      default: "special"
    },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Manager who approved/rejected
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewNotes: { type: String },
  },
  { timestamps: true }
);

// Update overall status based on branch approvals
specialCampaignSchema.methods.updateOverallStatus = function() {
  if (this.branches.length === 0) {
    this.status = "pending";
    return;
  }
  
  const approvalStatuses = Array.from(this.branchApprovalStatus.values());
  
  const allApproved = approvalStatuses.every(status => status === "approved");
  const allRejected = approvalStatuses.every(status => status === "rejected");
  const hasApproved = approvalStatuses.some(status => status === "approved");
  const hasRejected = approvalStatuses.some(status => status === "rejected");
  
  if (allApproved) {
    this.status = "approved";
  } else if (allRejected) {
    this.status = "rejected";
  } else if (hasApproved || hasRejected) {
    this.status = "partial";
  } else {
    this.status = "pending";
  }
};

module.exports = mongoose.model("SpecialCampaign", specialCampaignSchema, "specialCampaigns");
