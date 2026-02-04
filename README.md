# AI Chatbot for LLM Testing

This project is a modern Chatbot interface built with [Next.js](https://nextjs.org), designed specifically for testing and interacting with Large Language Model (LLM) endpoints.

It is particularly useful for developers running local LLMs (using tools like Oobabooga text-generation-webui, Ollama, or FastChat) who want to expose them via tunneling services like **ngrok** or **localtunnel** and test them with a clean, responsive UI.

## Features

- 💬 **Modern Chat Interface**: a polished UI with message history, streaming support (simulated), and optimistic updates.
- ⚙️ **Dynamic Endpoint Configuration**: Easily change the API endpoint URL directly from the settings dialog. Perfect for when your `ngrok` or `localtunnel` URL changes.
- 📝 **Markdown Support**: Full Markdown rendering for AI responses, including code highlighting.
- 💾 **Conversation History**: Saves your chats and messages using Prisma (SQLite by default).

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AhmadTahaCodes/ChatBot.git
   cd ChatBot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## connecting to Your LLM

1. **Start your Local LLM**: Run your LLM backend (e.g., text-generation-webui).
2. **Start a Tunnel**: exposing your local port (usually 5000 or similar) to the internet.
   ```bash
   ngrok http 5000
   # or
   lt --port 5000
   ```
3. **Configure the Chatbot**:
   - Open the Chatbot Settings (gear icon).
   - Paste your generated tunnel URL (e.g., `https://your-url.ngrok-free.app/api/v1/generate`).
   - Save and start chatting!

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **HTTP Client**: Axios
