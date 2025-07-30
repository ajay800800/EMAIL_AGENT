const nodemailer = require("nodemailer");
const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const { updateMemory, readMemory } = require("../memory/memory");
require("dotenv").config();

// Static contact book
const contactBook = {
  "Ajay": "v4927113@gmail.com",
  "Sumit": "crlcda8@gmail.com",
  "Karan": "karan@company.com"
};

// Send email
async function sendEmail({ to_name, subject, body }) {
  const to = contactBook[to_name] || null;
  if (!to) {
    throw new Error(`❌ No email found for contact: ${to_name}`);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body
  });

  updateMemory({
    last_sent: { to_name, subject, body },
    contact_cache: { ...(readMemory().contact_cache || {}), [to_name]: to }
  });

  return { messageId: info.messageId, to, subject };
}

// Read latest email (top unread or latest from inbox)
async function readLatestEmail() {
 const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }, // <== ADD THIS LINE
    authTimeout: 3000
  }
};


  const connection = await imaps.connect({ imap: config.imap });
  await connection.openBox("INBOX");

  const searchCriteria = ["UNSEEN"]; // or use ['ALL'] to fetch any
  const fetchOptions = { bodies: [""], markSeen: true };

  const results = await connection.search(searchCriteria, fetchOptions);
  if (!results.length) return null;

  const raw = results[0].parts[0].body;
  const parsed = await simpleParser(raw);

  const emailData = {
    from: parsed.from.text,
    subject: parsed.subject,
    text: parsed.text,
    messageId: parsed.messageId
  };

  updateMemory({ last_received: emailData });

  return emailData;
}

module.exports = { sendEmail, readLatestEmail };
