const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Campaign = require("../models/campaign");
const insertion = require("../utils/logFailedInsert");
const campaignQueue = require("../utils/campaignQueue");
const { authMiddleware }=require("../middleware/middlewareauth.js");

// ✅ Create Campaign


router.post("/", authMiddleware, async (req, res) => {
  try {
    const createdBy = req.decoded._id;

    if (!req.body.name || !req.body.metaData || !req.body.metaData.query) {
      return res.status(400).json({
        success: false,
        message: "name and metaData.query are required",
      });
    }

    const newCampaign = await Campaign.create({
      ...req.body,
      createdBy,
      result: [],
      metaData: {
        ...req.body.metaData,
        processingStatus: "queued",
        updatedRecords: 0,
        processingError: "",
      },
    });

    // populate user info before sending response
    const campaign = await Campaign.findById(newCampaign._id)
      .populate("createdBy", "username email fullName");

    await campaignQueue.add(
      "populateResults",
      { campaignId: campaign._id.toString(), query: req.body.metaData.query },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Campaign created successfully and queued",
      createdBy:campaign.createdBy,
      campaignId:campaign._id
    });
  } catch (err) {
    insertion(req.body, err);
    console.error("POST /api/campaign error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});





// ✅ Get Campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean().populate("createdBy", "username email fullName");;
    if (!campaign)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get Campaign list (for dashboard)
router.get("/",authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 1000, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.name = new RegExp(search, "i");

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();


    const formatted = campaigns.map((c) => ({
      _id: c._id,
      name: c.name,
      provider: c.provider || "N/A",
      communicationType: c.communicationType || "-",
      message: c.message || "-",
      startDate: c.startDate || null,
      endDate: c.endDate || null,
      status: c.status || "active",
      processingStatus: c.processingStatus || "queued",
      totalRecords: c.totalRecords || 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      result: formatted,
    });
  } catch (err) {
    console.error("GET /api/campaign/list error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Update Campaign Status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "Status required" });

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!campaign)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Delete Campaign
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
