// server.js
const express = require("express");
const dotenv = require("dotenv").config();
const { callPlanner } = require("./llm/planner");
const { sendEmail, readLatestEmail } = require("./tools/sendEmail");
const { readMemory, updateMemory } = require("./memory/memory");

const app = express();
app.use(express.json());

app.post("/agent", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const memory = readMemory();
    const plan = await callPlanner(prompt, memory);

    if (plan.tool === "send_email") {
      const result = await sendEmail(plan.params);
      updateMemory({ last_sent: plan.params });
      return res.json({ status: "Email sent", result });
    }

    if (plan.tool === "read_email" || plan.tool === "readLatestEmail") {
      const result = await readLatestEmail();
      updateMemory({ last_received: result });
      return res.json({ status: "Email received", result });
    }

    return res.status(400).json({ error: "Unknown or unsupported tool: " + plan.tool });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3088, () => console.log("🚀 Email agent running on port 3088"));
