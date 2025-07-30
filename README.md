

# 📬 AI Email Agent

A smart AI-powered Node.js email assistant that reads user prompts, uses an LLM (like Mistral via Ollama) to understand the intent, and sends emails using real SMTP credentials. Built with a tool-based architecture and a static contact book.

## 🧠 Features

- Understands natural language prompts
- Uses LLM planning to generate tool commands
- Sends real emails via Gmail using Nodemailer
- Stores last used memory context in JSON
- Easy to extend for more tools

## 📁 Project Structure

```
email-agent/
├── server.js           # Express server (runs the agent)
├── llm/
│   ├── planner.js      # Calls LLM to plan which tool to use
│   └── prompt.js       # Creates the prompt for the planner
├── tools/
│   └── sendEmail.js    # Nodemailer logic to send email
├── memory/
│   └── memory.js       # Stores last sent message and contact cache
├── .env                # Gmail credentials
└── package.json
```

## ⚙️ Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/email-agent.git
   cd email-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up `.env` file**:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the agent**:
   ```bash
   node server.js
   ```

## 🧪 Usage Example

Send a POST request to the agent:

```bash
curl -X POST http://localhost:3088/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Send an email to Sumit about the meeting at 5 PM"}'
```

**Expected response**:
```json
{
  "status": "Email sent",
  "result": {
    "messageId": "<some-id>",
    "to": "crlcda8@gmail.com",
    "subject": "Meeting at 5 PM",
    "body": "..."
  }
}
```

## 📒 Contact Book

Defined in `tools/sendEmail.js`:

```javascript
const contactBook = {
  "Ajay": "v4927113@gmail.com",
  "Sumit": "crlcda8@gmail.com",
  "Karan": "karan@company.com"
};
```

## 💡 LLM Planner

Example LLM output for planning:

```json
{
  "tool": "send_email",
  "params": {
    "to_name": "Ajay",
    "subject": "Reminder",
    "body": "Don't forget our call at 4 PM."
  }
}
```

## 🧠 Memory File

Example `memory/memory.json`:

```json
{
  "last_sent": { "to_name": "Ajay", "subject": "...", "body": "..." },
  "contact_cache": { "Ajay": "v4927113@gmail.com" }
}
```

## 🧩 Future Enhancements

- Add reply email functionality
- Fetch & summarize inbox
- Use database for dynamic contacts
- Integrate voice input using Whisper

## 🪪 License

MIT – Free to use and modify

