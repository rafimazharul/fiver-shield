# FiverShield – Next.js

Converted from vanilla HTML/React CDN to a full Next.js 14 project with Tailwind CSS.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Add your icon images
Copy your `icon_images/` folder into the `public/` directory:
```
public/
  icon_images/
    favicon.png
    fs_Icon.svg
    alert.png
    message.png
    highlight.png
    make-safe.png
    copy.png
    re-edit.png
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm start
```

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
│   └── icon_images/       # ← Place your icons here
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## What Changed

| Before | After |
|---|---|
| Single `index.html` with CDN scripts | Next.js 14 App Router project |
| `React.createElement()` calls | JSX syntax |
| Tailwind via CDN `<script>` | Tailwind via PostCSS (proper build) |
| `document.documentElement` dark mode | Same – works in `'use client'` component |
| Icons via relative path `icon_images/` | Icons served from `public/icon_images/` |
