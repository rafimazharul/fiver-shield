# FiverShield – Next.js

Protect your Fiverr messages from policy violations with FiverShield – a modern web application built with Next.js.

## Tech Stack

- **Next.js 14** – React framework with App Router
- **React 18** – UI library
- **Tailwind CSS** – Utility-first CSS framework
- **React Toastify** – Notifications
- **PostCSS** – CSS processing

## Features

- 🔒 **Risky Word Detection**: Detects and replaces risky words/phrases
- 🎨 **Dark/Light Mode**: Toggle between themes
- ✨ **Highlight Words**: Option to highlight risky words
- 📋 **Rich Text Copy**: Copy formatted text (preserves colors)
- 📝 **Line Breaks for Labels**: Auto line breaks after Buyer/Seller labels
- 📊 **Word/Character Count**: Counts for input and output
- 🔄 **Re-edit**: Paste safe message back for editing

## Project Structure

```
fivershield/
├── app/
│   ├── globals.css        # Global styles (ripple, toast, Tailwind)
│   ├── layout.jsx         # Root layout with metadata & favicon
│   └── page.jsx           # Home page
├── components/
│   └── FiverShieldTool.jsx  # Main app component (all logic)
├── public/
│   └── icon_images/       # Static assets/icons
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── package.json
```

## Installation

### 1. Install dependencies
```bash
npm install
```

## Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Usage

1. Write or paste your Fiverr message in the input field
2. Toggle "Highlight words" (optional)
3. Click **Make Safe** to process the message
4. Click **Copy Text** to copy the safe message
5. Click **Re-edit** to send safe message back to input for further edits

## License
MIT

## Live Link
Please check this out=> [https://bdt-alpha.mvp.bd/](https://bdt-alpha.mvp.bd/)
