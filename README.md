# NovaAI - AI-Powered SaaS Creative Workspace & Resume Builder

NovaAI is a premium, state-of-the-art MERN-stack SaaS workspace featuring an AI content generator suite, ATS validator tools, and an interactive, template-driven Resume Builder.

---

## 🚀 Key Features

* **Immersive Resume Builder**: Standardized dark-themed tab editor (Contact, Experience, Education, Projects, Skills, Extras, Layout & Theme) with live A4 preview scaling, color/style selector dropdowns, and PDF/image export options.
* **AI Assist Sparkles**: Auto-generate professional summary bios, polish resume bullet points, and auto-recommend industry-specific skills.
* **Workspace AI Suite**:
  * **Article Generator**: Notion-like markdown writing workspace powered by Gemini API.
  * **Blog Title Creator**: Catchy headline suggestion engine with tone filters.
  * **Image Generator**: Futuristic high-res illustrations with community options.
  * **Background Remover**: Clean transparency cuts on images via Cloudinary.
  * **ATS Score Checker**: Score analysis to optimize resumes against job descriptions.
* **Premium SaaS Aesthetics**: Sleek dark-mode interface with spotlight grids, glowing purple blur orbs, and hover profile tooltip overlays.

---

## 🛠️ Setup Instructions

### 1. Backend Server Setup
Navigate to the `server/` directory:
```bash
cd server
npm install
```
Copy `server/.env.example` to `server/.env` and insert your credentials:
* MongoDB URI
* Gemini API Key
* Cloudinary API Credentials
* Mailjet SMTP API Keys
* Razorpay Keys (optional for dev mockups)

Start the server:
```bash
npm run dev
```

### 2. Frontend Client Setup
Navigate to the `client/` directory:
```bash
cd ../client
npm install
```
Copy `client/.env.example` to `client/.env` and insert your Firebase client keys.

Start the client development server:
```bash
npm run dev
```
The app will open at `http://localhost:5173/`.

---

## 📦 Tech Stack
* **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, html2canvas, jsPDF
* **Backend**: Node.js, Express, MongoDB Mongoose
* **Auth**: Firebase Client Auth + JWT Session Tokens
