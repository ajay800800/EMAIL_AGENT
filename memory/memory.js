
const fs = require("fs");
const path = require("path");
const memoryPath = path.join(__dirname, "memory.json");

function readMemory() {
  if (!fs.existsSync(memoryPath)) return {};
  return JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
}

function updateMemory(updates) {
  const current = readMemory();
  const updated = { ...current, ...updates };
  fs.writeFileSync(memoryPath, JSON.stringify(updated, null, 2));
  return updated;
}

function clearMemory() {
  fs.writeFileSync(memoryPath, "{}");
}

module.exports = { readMemory, updateMemory, clearMemory };
