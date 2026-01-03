const fs = require("fs");
const csv = require("csvtojson");

async function generateJSONFromCSV(filePath) {
  try {
    const jsonArray = await csv().fromFile(filePath);

    const filtered = jsonArray.filter(item => !item.Company || item.Company.trim() === "");

    fs.writeFileSync("public/data.json", JSON.stringify(filtered, null, 2));

    return filtered;
  } catch (err) {
    console.error("❌ Error converting CSV:", err);
  }
}

module.exports = { generateJSONFromCSV };
