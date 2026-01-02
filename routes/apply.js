const express = require("express");
const EmailQueue = require("../models/EmailQueue");

const router = express.Router();

router.post("/", async (req, res) => {
  const { service, name, email, phone, city } = req.body;

  if (!service || !name || !email || !phone || !city) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    // 🔁 Push to queue
    await EmailQueue.create({
      payload: {
        service,
        name,
        email,
        phone,
        city
      }
    });

    // ✅ Respond immediately (no waiting for email)
    res.status(200).json({
      success: true,
      message: "Service registered successfully"
    });

  } catch (error) {
    console.error("❌ Register route error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to process request"
    });
  }
});

module.exports = router;
