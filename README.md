# 🌿 ThriftFit DuvALL | Sustainable Clothing Initiative

> A Duval County student sustainability initiative empowering high schoolers to discover nearby thrift shops, compare clothing categories & verified dressing rooms, and calculate real eco-savings to choose secondhand over fast fashion.

![ThriftFit DuvALL Palette](https://img.shields.io/badge/Palette-Ivory%20%7C%20Mint%20%7C%20Buttercup%20%7C%20Tangerine-EFAE6E)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)

---

## 🎨 Aesthetic & Design System

The application is built around a custom retro-psychedelic minimalist design system:

| Color Role | Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas** | Ivory | `#FBEFD9` | Primary page backdrop, modal panels, and surface cards |
| **Eco / Status** | Mint | `#C1D7C2` | Dressing room verified badges, eco metrics, nearest thrift pins |
| **Secondary Accent** | Buttercup | `#F7E09A` | Filter tags, sunny category pills, toolbar containers |
| **Primary CTA** | Tangerine | `#EFAE6E` | Action buttons, active filter chips, campus beacon pins |
| **High Contrast Text**| Deep Espresso | `#2E1F16` | Text typography, retro tactile borders (`border-2 border-[#2E1F16]`) |

**Typography**:
- **Display Titles & Logos**: `Shrikhand` & `Caprasimo` (Google Fonts) – retro cloud bubble letterforms
- **Body & Controls**: `Nunito` (Google Fonts) – accessible, clean, readable sans-serif

---

## ✨ Key Features

- 📍 **Duval High School Campus Auto-Matcher**: Select your Duval County high school (Stanton, Paxon, Fletcher, Atlantic Coast, Mandarin, etc.) or college to instantly recalculate distances and sort thrift stores by proximity.
- 🗺️ **Interactive Cartography Map**: Custom Leaflet map with color-coded custom SVG markers for campuses (Tangerine) and thrift stores (ranked Mint for closest, Buttercup for standard).
- 👗 **Interactive Fit Finder & Outfit Simulator**: Compare fast-fashion hauls vs. thrifted hauls across denim, jackets, graphic tees, and streetwear with realistic dollar and water gallon savings.
- 🏪 **Comprehensive Store Directory & Compare Tool**:
  - Filter by clothing inventory (Vintage 90s/Y2K, Designer/Curated, Budget Basics, Streetwear, Prom/Formal).
  - Verified Dressing Room status check (Open & private, Limited, or No fitting rooms).
  - Student discount badges and dollar pricing tiers (`$` to `$$$`).
  - Side-by-side store compare modal.
- 💧 **Secondhand Eco Impact Calculator**: Calculate gallons of water saved, carbon emissions avoided, and textile waste diverted per garment thrifted.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/thriftfit-duvall.git
cd thriftfit-duvall
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle is output to `dist/`.

---

## ⚡ Deployment to Vercel

### Option 1: Automatic Deployment via GitHub (Recommended)
1. Push this repository to GitHub (see [GitHub Sync Guide](#-sync-to-github) below).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** -> **"Project"**.
4. Import your `thriftfit-duvall` GitHub repository.
5. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**. Your site will be live with a production HTTPS URL in ~30 seconds!

### Option 2: Deploy directly via Vercel CLI
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Log in and deploy
vercel
```

The included `vercel.json` already has SPA routing rewrites configured (`/(.*)` -> `/index.html`) so client-side navigation and deep URLs work smoothly without 404s.

---

## 🐙 Sync to GitHub

Follow these steps to connect your local project to a new GitHub repository:

### 1. Create a new repository on GitHub
Go to [github.com/new](https://github.com/new) and create a repository named `thriftfit-duvall` (leave "Initialize with README" unchecked).

### 2. Push local code to GitHub
```bash
# Initialize git if not already initialized
git init -b main

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit of ThriftFit DuvALL sustainable fashion initiative"

# Link your remote repository (replace with your GitHub URL)
git remote add origin https://github.com/<YOUR-USERNAME>/thriftfit-duvall.git

# Push to main
git push -u origin main
```

---

## 📦 Project Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular React components
│   │   ├── CampusSwitcherBar.tsx    # High school selector bar
│   │   ├── InteractiveFitFinder.tsx # Vibe & outfit cost simulator
│   │   ├── StoreDirectory.tsx       # Directory, filters, search & card list
│   │   ├── StoreDetail.tsx          # Comprehensive individual store modal/view
│   │   ├── StoreCompareModal.tsx    # Side-by-side store comparator
│   │   ├── ThriftMap.tsx            # Leaflet map with custom SVG pins
│   │   ├── ThriftLogo.tsx           # Stylized retro typography logo
│   │   ├── ThriftVisuals.tsx        # Responsive SVG editorial illustrations
│   │   └── ...
│   ├── data/
│   │   └── thriftStores.ts # Duval County stores, high schools & inventory metadata
│   ├── App.tsx             # Main application layout and view controller
│   ├── index.css           # Tailwind v4 styles, custom fonts, theme variables
│   └── main.tsx            # React 19 entry point
├── vercel.json             # Vercel deployment configuration & SPA routing
├── vite.config.ts          # Vite build configuration
└── package.json            # Project dependencies & build scripts
```

---

## 📜 License
MIT © Duval County Sustainable Student Initiative
