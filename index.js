require("dotenv").config();
const express = require("express");
const cors = require("cors");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// Brevo client
const client = SibApiV3Sdk.ApiClient.instance;

// ✅ CORRECT AUTH KEY NAME
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

app.get("/", (req, res) => {
  res.send("Domestic Help Backend Running");
});

app.post("/register", async (req, res) => {
  const { service, name, email, phone, city } = req.body;

  if (!service || !name || !email || !phone || !city) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: "no-reply@domestichelpapp.com",
        name: "Domestic Help App",
      },
      to: [{ email: process.env.ADMIN_EMAIL }],
      subject: `New Service Registration: ${service}`,
      htmlContent: `
        <h3>New Service Registration</h3>
        <p><b>Service:</b> ${service}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>City:</b> ${city}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Registration email sent",
    });
  } catch (error) {
    console.error("BREVO ERROR:", error.response?.body || error.message);
    res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
