const express = require("express");
const Member = require("../models/memberModel");

const router = express.Router();

// ✅ Get All Members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// ✅ Add a New Member
router.post("/add", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Name and Type are required" });
    }

    const newMember = new Member({ name, type });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

module.exports = router;
