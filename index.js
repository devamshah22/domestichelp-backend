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
});

// API to receive registration
app.post("/register", async (req, res) => {
  const {
    service,
    name,
    email,
    phone,
    state,
    city,
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
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
State: ${state}
City: ${city}
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Registration email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email failed to send" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
