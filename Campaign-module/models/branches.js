const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  code: { type: String, trim: true, unique: true,required:true},
  name: { type: String, trim: true, unique: true,required:true},
  city: { type: String, trim: true, unqiue: true,required:true},
}, { timestamps: true });

BranchSchema.index({ code: 1, name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model("Branch", BranchSchema);

