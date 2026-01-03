const express = require("express");
const router = express.Router();
const SpecialCampaign = require("../models/specialCampaign");
const { authMiddleware } = require("../middleware/middlewareauth.js");

// ✅ Create Special Campaign
router.post("/", authMiddleware, async (req, res) => {
  try {
    const createdBy = req.decoded._id;

    if (!req.body.name || !req.body.targetAmount || !req.body.branches || req.body.branches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, target amount, and at least one branch are required",
      });
    }

    // Initialize branch approval status for all selected branches
    const branchApprovalStatus = {};
    req.body.branches.forEach(branchId => {
      branchApprovalStatus[branchId] = "pending";
    });

    const newCampaign = await SpecialCampaign.create({
      ...req.body,
      createdBy,
      branchApprovalStatus,
      status: "pending",
    });

    const campaign = await SpecialCampaign.findById(newCampaign._id)
      .populate("createdBy", "username email fullName")
      .populate("branches", "name code city");

    res.status(201).json({
      success: true,
      message: "Special campaign created successfully. Waiting for manager approval.",
      campaign,
    });
  } catch (err) {
    console.error("POST /api/special-campaigns error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get all Special Campaigns
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 100, status } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await SpecialCampaign.countDocuments(query);
    const campaigns = await SpecialCampaign.find(query)
      .populate("createdBy", "username email fullName")
      .populate("branches", "name code city")
      .populate("reviewedBy", "username email fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      campaigns,
    });
  } catch (err) {
    console.error("GET /api/special-campaigns error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get Single Special Campaign
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await SpecialCampaign.findById(req.params.id)
      .populate("createdBy", "username email fullName")
      .populate("branches", "name code city")
      .populate("reviewedBy", "username email fullName")
      .lean();

    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        message: "Special campaign not found" 
      });
    }

    res.json({ success: true, campaign });
  } catch (err) {
    console.error("GET /api/special-campaigns/:id error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Manager Approval/Rejection for specific branches
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    const { branchApprovals } = req.body;
    // branchApprovals should be an object like: { branchId1: "approved", branchId2: "rejected", ... }
    
    if (!branchApprovals || typeof branchApprovals !== "object") {
      return res.status(400).json({
        success: false,
        message: "branchApprovals object is required with branch IDs and their approval status",
      });
    }

    const campaign = await SpecialCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        message: "Special campaign not found" 
      });
    }

    // Update branch approval statuses
    Object.keys(branchApprovals).forEach(branchId => {
      const status = branchApprovals[branchId];
      if (["approved", "rejected", "pending"].includes(status)) {
        campaign.branchApprovalStatus.set(branchId, status);
      }
    });

    // Update overall status
    campaign.updateOverallStatus();
    
    // Set reviewer info
    campaign.reviewedBy = req.decoded._id;
    campaign.reviewedAt = new Date();

    await campaign.save();

    const updatedCampaign = await SpecialCampaign.findById(campaign._id)
      .populate("createdBy", "username email fullName")
      .populate("branches", "name code city")
      .populate("reviewedBy", "username email fullName");

    res.json({ 
      success: true, 
      message: "Branch approvals updated successfully",
      campaign: updatedCampaign 
    });
  } catch (err) {
    console.error("PUT /api/special-campaigns/:id/approve error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Update Special Campaign
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await SpecialCampaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username email fullName")
      .populate("branches", "name code city")
      .populate("reviewedBy", "username email fullName");

    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        message: "Special campaign not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Special campaign updated successfully",
      campaign 
    });
  } catch (err) {
    console.error("PUT /api/special-campaigns/:id error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Delete Special Campaign
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await SpecialCampaign.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Special campaign not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Special campaign deleted successfully" 
    });
  } catch (err) {
    console.error("DELETE /api/special-campaigns/:id error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
