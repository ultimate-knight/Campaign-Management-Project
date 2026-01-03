const express = require("express");
const router = express.Router();
const Branch = require("../models/branches");
const insertion=require("../utils/logFailedInsert")



router.post("/",async (req,res)=>{
    try {
        const branch=await Branch.create(req.body);

    res.status(201).json({Error:false,result:branch})
    } catch (error) {
        await insertion(req.body,error);
        res.status(500).json({Error:true,message:error.message})
        
    }

})

router.get("/", async (req, res) => {

  try {
    const branches = await Branch.find();
    console.log("branches found:", branches.length);
    res.status(200).json({
      success: true,
      count: branches.length,
      result: branches,
    });
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;
