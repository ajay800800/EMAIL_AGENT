const axios = require("axios");
const { getPrompt } = require("./prompt");

async function callPlanner(userInput, memory) {
  const prompt = getPrompt(userInput, memory);

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "mistral",
    prompt,
    stream: false
  });

  let raw = res.data.response.trim().replace(/```json|```/g, "");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("❌ LLM returned bad JSON: " + raw);
  }
}

module.exports = { callPlanner };
