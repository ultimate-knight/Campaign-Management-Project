const mongoose = require('mongoose');
const { generateJSONFromCSV } = require("../utils/csvHandler");
const { insertJSONIntoDB } = require("../services/index.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deltaERP', {
      dbName: "campaignDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await generateJSONFromCSV("public/ResDetailsReport.csv");
    await insertJSONIntoDB();

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
