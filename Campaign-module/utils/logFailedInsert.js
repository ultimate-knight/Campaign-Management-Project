
const path = require("path");
const fs = require("fs");

const FAIL_FILE = path.join(__dirname, "../public/InsertionFail.json");

async function InsertionFail(docs, error) {
  try {
    
    const dir = path.dirname(FAIL_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let data = { failedCount: 0, failures: [] };

    
    if (fs.existsSync(FAIL_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(FAIL_FILE, "utf-8"));
      } catch (parseErr) {
        console.error("parse error",parseErr);
      }
    }

    
    data.failures.push({
      docs,
      message: error.message|| error,
      timeStamp: new Date().toISOString(),
    });

    data.failedCount = data.failures.length;

    fs.writeFileSync(FAIL_FILE, JSON.stringify(data, null, 2));

    console.log("⚠️ Logged failed insert to InsertionFail.json");
    return data;
  } catch (err) {
    console.error("❌ Error writing failed insert log:", err);
  }
}

module.exports = InsertionFail;
