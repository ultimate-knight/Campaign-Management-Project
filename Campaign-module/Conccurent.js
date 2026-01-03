//To imitate two users sending request at the same time.To run press node Conccurent.js in other terminal//
const axios = require("axios");

const baseURL = "http://localhost:3000/api/campaign";

const payloadA = {
  name: "September Promo Campaign",
  createdBy: "651fae1b9f1a3a1234567890",
  metaData: {
    query: "{'branch':'68ca0406959b8811f22833bd'}",
    communication: {
      type: "email",
      provider: "sendgrid",
      message: "Hello! Don’t miss our special September offers."
    },
    startDate: "2025-09-25T00:00:00.000Z",
    endDate: "2025-09-30T23:59:59.000Z",
    totalRecords: 5000,
    updatedRecords: 0
  },
  status: "active"
};

const payloadB = {
 name: "Small campaign",
  createdBy: "651fae1b9f1a3a1234567890",
  metaData: {
    query: "{'branch':'68ca0406959b8811f22833d3'}",
    communication: {
      type: "email",
      provider: "sendford",
      message: "Hello! Don’t miss our special September offers."
    },
    startDate: "2025-09-25T00:00:00.000Z",
    endDate: "2025-09-30T23:59:59.000Z",
    totalRecords: 5000,
    updatedRecords: 0
  },
  status: "active"
};

async function run() {
  try {
    // Fire both requests simultaneously
    const [resA, resB] = await Promise.all([
      axios.post(baseURL, payloadA),
      axios.post(baseURL, payloadB)
    ]);

    console.log("Campaign A:", resA.data);
    console.log("Campaign B:", resB.data);

  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

run();
