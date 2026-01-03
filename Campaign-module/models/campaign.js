const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    provider: { type: String, required: true },
    communicationType: {
      type: String,
      enum: ["sms", "email", "whatsapp"],
      default: "sms",
    },
    message: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    totalRecords: { type: Number, default: 0 },
    updatedRecords: { type: Number, default: 0 },
    processingStatus: {
      type: String,
      enum: ["queued", "processing", "done", "failed"],
      default: "queued",
    },
    processingError: { type: String, default: "" },

    status: {
      type: String,
      enum: ["active", "inactive", "archived","failed","queued","processing","done"],
      default: "active",
    },

    // 🔹 Final campaign result
    result: [
      {
        userData: {
          referenceId: mongoose.Schema.Types.ObjectId,
          name: String,
          email: String,
          mobileNo: String,
          gender: String,
          nationality: String,
        },
        personalizedMsg: String,
        communicationStatus: {
          type: String,
          enum: ["new", "pending", "sent", "failed"],
          default: "new",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema, "campaign");
