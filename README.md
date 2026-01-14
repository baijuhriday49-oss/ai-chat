# HTML AI Assistant Pro

A modern, responsive, and performance-optimized AI Assistant interface built with Vanilla JavaScript, Tailwind CSS, and LocalStorage. No complex build tools or servers required – just open `index.html` and start chatting.

## Features

- **Conversational Chat Interface**: Beautiful message bubbles for user and AI interactions.
- **Markdown Support**: Automatic rendering of Markdown, including code blocks with syntax styling.
- **Chat Management**:
    - Persistent chat history using browser `localStorage`.
    - Create multiple separate chat sessions.
    - Delete individual sessions.
- **Customizable Configuration**:
    - Support for any OpenAI-compatible API endpoint.
    - Select models (GPT-3.5, GPT-4, etc.).
    - Secure API key handling (stored only in your browser storage, never sent to our servers).
- **Responsive UI/UX**:
    - Dark & Light mode support.
    - Mobile-friendly sidebar and navigation.
    - Auto-resizing input textarea.
    - Smooth animations and transitions.

## Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge).
- An API Key from an OpenAI-compatible provider (e.g., OpenAI, Anthropic via a proxy, or local LLMs like Ollama).

## Installation

1. Copy the project files to your local machine or a web server.
2. Ensure the directory structure is preserved:
    - `index.html`
    - `assets/css/styles.css`
    - `assets/js/app.js`
    - `assets/js/api.js`
    - `assets/js/ui.js`
    - `assets/js/storage.js`

## How to Run

1. Open `index.html` directly in your browser or use a simple static server (like Live Server extension in VS Code).
2. Click the **Settings** icon in the bottom-left sidebar.
3. Enter your **OpenAI API Key**.
4. (Optional) Adjust the Model or Endpoint.
5. Save settings and start chatting!

## Configuration Instructions

- **API Endpoint**: By default, it uses `https://api.openai.com/v1/chat/completions`. If you use a provider like Groq, Together AI, or a local server, change this URL.
- **Model**: Matches the model ID required by your provider (e.g., `gpt-4o-mini`).

## External Assets Used

- **Tailwind CSS**: Core styling framework.
- **Lucide Icons**: Modern, lightweight SVG icon set.
- **Marked.js**: High-performance Markdown parser for the AI responses.
- **Inter Font**: Sans-serif typeface via Google Fonts.

## Troubleshooting

- **API Errors**: If the AI doesn't respond, check your API key and ensure you have sufficient credits on your provider's account. Check the browser console (F12) for specific error messages.
- **Persistent Data**: If you clear your browser's "Site Data" or "LocalStorage," your chat history will be lost.
- **Layout Issues**: Ensure you have an active internet connection to load the CSS/JS CDNs (Tailwind, Lucide).

## Project Structure Explained

- `assets/js/storage.js`: Logic for JSON serialization into localStorage.
- `assets/js/api.js`: Wrapper for window.fetch to communicate with LLM APIs.
- `assets/js/ui.js`: Encapsulates all DOM manipulation to keep logic clean.
- `assets/js/app.js`: Connects everything together (Event listeners and state management).
