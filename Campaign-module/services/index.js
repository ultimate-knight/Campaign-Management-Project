const fs = require("fs");
const moment = require("moment");
const Branch = require("../models/branches");
const Report = require("../models/reports");

async function insertJSONIntoDB() {
  try {
    const data = JSON.parse(fs.readFileSync("public/data.json", "utf-8"));

    console.log("📊 Total items to process:", data.length);

    for (let item of data) {
      try {
        let branch = null;
        if (item["Collection Branch"]?.trim()) {
          const text = item["Collection Branch"].trim();
          let code = null, name = null, city = null;

          if (text.includes("-")) {
            const [c, ...rest] = text.split("-");
            code = c?.trim() || null;
            const remaining = rest.join("-").trim();
            if (remaining.includes(",")) {
              [name, city] = remaining.split(",").map(s => s.trim());
            } else name = remaining || null;
          } else if (text.includes(",")) {
            const [first, c] = text.split(",").map(s => s.trim());
            city = c || null;
            const [c1, ...n] = first.split(" ");
            code = c1 || null;
            name = n.join(" ").trim() || null;
          } else {
            const parts = text.split(" ");
            code = parts[0] || null;
            name = parts.slice(1).join(" ").trim() || null;
          }

          if (code || name || city) {
            branch = await Branch.findOneAndUpdate(
              { code, name, city },
              { code, name, city },
              { upsert: true, new: true }
            );
          }
        }

        // --- Report Data ---
        const reportData = {
          OrderId: item["OrderID"] || item["OrderId"] || null,
          ReservationType: item["Reservation Type"] || item["ReservationType"] || null,
          PatientName: item["Patient Name"] || item["PatientName_en"] || null,
          Identification: item["Identification"] || null,
          Gender: item["Gender"] || null,
          MobileNo: item["Mobile No"] || item["MobileNo"] || null,
          Nationality: item["Nationality"] || null,

          BirthDate: item["Birth Date"]
            ? moment(item["Birth Date"], ["YYYY-MM-DD", "DD-MM-YYYY", "YYYY/MM/DD"]).toDate()
            : null,
          BookingTime: item["Booking Time"]
            ? moment(item["Booking Time"], ["YYYY-MM-DD HH:mm:ss", "YYYY/MM/DD HH:mm:ss"]).toDate()
            : null,

          Passport: item["Passport"],
          PaymentMethod: item["Payment Method"] || item["PaymentMethod"],
          Price: item["Price"],
          DiscountAmount: item["Discount Amount"] || item["DiscountAmount"],
          CashAmount: item["Cash Amount"] || item["CashAmount"],
          VisaAmount: item["Visa Amount"] || item["VisaAmount"],
          RefundAmount: item["Refund Amount"] || item["RefundAmount"],
          OnlineAmount: item["Online Amount"] || item["OnlineAmount"],
          BankTransfer: item["Bank Transfer"] || item["BankTransfer"],
          Tabby: item["Tabby"] || "0",
          Tamara: item["Tamara"] || "0",
          SubTotal: item["Subtotal"] || item["Sub Total"] || item["SubTotal"],
          Tax: item["TAX"] || item["Tax"],
          TotalAmount: item["Total Amount"] || item["TotalAmount"],
          Company: item["Company"] || "",
          OnlineId: item["Online ID"] || item["Online Id"] || item["OnlineId"],
          FromBlazma: item["From Blazma"] || item["FromBlazma"],
          ReferenceOrderId: item["Reference Order ID"] || item["Reference Order Id"] || item["ReferenceOrderId"],
          TransferNo: item["Transfer No."] || item["Transfer No"] || item["TransferNo"],
          PosSerialNo: item["POS Serial Number"] || item["Pos Serial No"] || item["PosSerialNo"],
          DoctorRef: item["Doctor Reference"] || item["Doctor Ref"] || item["DoctorRef"],
          RefundTime: item["Refund Time"] || item["RefundTime"],
          InvoiceNumber: item["Invoice Number"] || item["InvoiceNumber"],
          branch: branch?._id || null,
        };

        await Report.create(reportData);

      } catch (err) {
        console.error("❌ Error processing item:", err.message);
      }
    }

    await Report.updateMany({}, { $unset: { combined: "" } });

    return {
      success: true,
      message: "Data inserted successfully",
      summary: {
        totalReports: await Report.countDocuments(),
        totalBranches: await Branch.countDocuments(),
      },
    };

  } catch (err) {
    console.error("❌ Error inserting data:", err);
    throw err;
  }
}

module.exports = { insertJSONIntoDB };
