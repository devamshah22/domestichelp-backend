require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  debug: true,
  logger: true,
});


// Health check (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Domestic Help Backend Running");
});

// Registration API
app.post("/register", async (req, res) => {
  const { service, name, email, phone, city } = req.body;

  if (!service || !name || !email || !phone || !city) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!process.env.ADMIN_EMAIL) {
    return res.status(500).json({ message: "Admin email not configured" });
  }

  const mailOptions = {
    from: `"Domestic Help App" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Service Registration: ${service}`,
    text: `
New Service Registration

Service: ${service}
Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Registration email sent",
    });
  } catch (error) {
  console.error("FULL EMAIL ERROR:", error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
}

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
