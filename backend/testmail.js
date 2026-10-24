// testmail.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const t = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_FROM_EMAIL,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

t.sendMail({
  from: process.env.GMAIL_FROM_EMAIL,
  to: process.env.GMAIL_FROM_EMAIL,
  subject: "test",
  text: "works",
})
  .then(() => console.log("OK"))
  .catch((e) => console.error("FAIL:", e.message));