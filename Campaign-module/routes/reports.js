const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Report = require("../models/reports");
const Branch = require("../models/branches");
const { insertJSONIntoDB } = require("../services/index");
const insertion = require("../utils/logFailedInsert");

// ✅ Create Report
router.post("/", async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json({ Error: false, result: report });
  } catch (error) {
    await insertion(req.body, error);
    res.status(500).json({ Error: true, message: error.message });
  }
});

// ✅ Get Reports with filters
router.get("/", async (req, res) => {
  try {
    const {
      branchId,
      startDate,
      endDate,
      gender,
      test,
      nationality,
      page = 1,
      limit = 100,
    } = req.query || {};
    const query = {};

    // 🔹 Optional branch filter
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      query.branch = new mongoose.Types.ObjectId(branchId);


      //optional gender filter
      if (gender) {
        if (gender === "Male" || gender === "Female") {
          query.Gender = gender;
        }
      }
    }

    //optional nationality filter
    if (nationality && nationality !== "All") {
      query.Nationality = nationality;
    }

    // 🔹 Optional test filter
    if (test) {
      query.ReservationType = { $regex: new RegExp(test, "i") };
    }

    // 🔹 Optional date range filter (BookingTime field)
    if (startDate && endDate) {
      query.BookingTime = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // include end of day
      };
    } else if (startDate) {
      query.BookingTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.BookingTime = {
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    console.log("📋 Report Query:", JSON.stringify(query, null, 2));

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 50, 1000);
    const skip = (pageNum - 1) * limitNum;

    const filteredCount = await Report.countDocuments(query);
    console.log("📊 Total matching records:", filteredCount);

    const reports = await Report.find(query)
      .populate({
        path: "branch",
        select: "code name city",
        options: { lean: true },
      })
      .skip(skip)
      .limit(limitNum)
      .lean()
      .sort({ createdAt: -1 });

    // Format dates for frontend
    reports.forEach((r) => {
      if (r.BookingTime) r.BookingTime = new Date(r.BookingTime).toISOString();
      if (r.BirthDate)
        r.BirthDate = new Date(r.BirthDate).toISOString().split("T")[0];
    });

    res.json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredCount,
        totalPages: Math.ceil(filteredCount / limitNum),
        hasNext: pageNum * limitNum < filteredCount,
        hasPrev: pageNum > 1,
      },
      count: reports.length,
      results: reports,
    });
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Reset route (keep as is)
router.get("/reset", async (req, res) => {
  try {
    await Report.deleteMany({});
    const result = await insertJSONIntoDB();
    res.json({
      success: true,
      message: "Reports reset and re-imported successfully",
      summary: result.summary,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
