const axios = require("axios");

async function sendWebhook(data) {
  try {
    await axios.post(process.env.WEBHOOK_URL, data);
  } catch {
    console.log("Webhook failed");
  }
}

module.exports = { sendWebhook };