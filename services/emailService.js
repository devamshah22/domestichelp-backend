const SibApiV3Sdk = require("sib-api-v3-sdk");

// Brevo config
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendDomesticHelpEmail(payload) {
  const { service, name, email, phone, city } = payload;

  await emailApi.sendTransacEmail({
    sender: {
      email: process.env.SENDER_EMAIL,
      name: "Any Domestic Help"
    },
    to: [
      {
        email: process.env.ADMIN_EMAIL,
        name: "Admin"
      }
    ],
    subject: `New Service Registration: ${service}`,
    htmlContent: `
      <h2>New Domestic Help Registration</h2>
      <p><b>Service:</b> ${service}</p>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>City:</b> ${city}</p>
    `
  });
}

module.exports = sendDomesticHelpEmail;
