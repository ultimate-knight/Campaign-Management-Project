const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    OrderId: {
      type: String,
      trim: true,
      // required:true
    },

    ReservationType: {
      type: String,
      trim: true,
    },

    PatientName: {
      type: String,
      trim: true,
      // required:true
    },

    Identification: {
      type: String,
      trim: true,
      // required:true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      // required: true,
    },
    combined: { type: String, trim: true },

    Gender: {
      type: String,
      trim:true,
      // required:true
    },

    MobileNo: {
      type: String,
      trim: true,
      // required:true
    },

    Nationality: {
      type: String,
      trim: true,
      // required:true
    },

    BirthDate: {
      type: Date,

    },

    Passport: {
      type: String,
      trim: true,
      // required:true
    },

    BookingTime: {
      type: Date,
    },

    PaymentMethod: {
      type: String,
      trim: true,
    },

    Price: {
      type: String,
      trim: true,
    },

    DiscountAmount: {
      type: String,
      trim: true,
    },

    CashAmount: {
      type: String,
      trim: true,
    },

    VisaAmount: {
      type: String,
      trim: true,
    },

    RefundAmount: {
      type: String,
      trim: true,
    },

    OnlineAmount: {
      type: String,
      trim: true,
    },

    BankTransfer: {
      type: String,
      trim: true,
    },

    Tabby: {
      type: String,
      trim: true,
    },

    Tamara: {
      type: String,
      trim: true,
    },

    SubTotal: {
      type: String,
      trim: true,
    },

    Tax: {
      type: String,
      trim: true,
    },

    TotalAmount: {
      type: String,
      trim: true,
    },

    Company: {
      type: String,
      trim: true,
    },

    OnlineId: {
      type: String,
      trim: true,
      // required:true
    },

    FromBlazma: {
      type: String,
      trim: true,
    },

    ReferenceOrderId: {
      type: String,
      trim: true,
    },

    TransferNo: {
      type: String,
      trim: true,
    },

    PosSerialNo: {
      type: String,
      trim: true,
    },

    DoctorRef: {
      type: String,
      trim: true,
    },

    RefundTime: {
      type: String,
      trim: true,
    },

    InvoiceNumber: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema, "report");
