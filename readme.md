Visual Product Finder – AI Image Similarity Search

A web application that allows users to upload an image and instantly find visually similar products from a pre-built product dataset. The project demonstrates image-based search, product filtering, responsive design, and clean frontend architecture.

🚀 Features

📤 Image Upload (File + URL input)

🔍 AI-powered visual similarity search

🗂 50+ product dataset with images, categories & metadata

⚡ Fast Vite + React + Tailwind frontend

🎛 Filters & similarity scoring

📱 Mobile responsive UI

🧩 Clean folder structure and maintainable code

🌐 Deployable on free hosting (Vercel / Netlify)

📂 Project Structure
/
├── public/               # Static assets
├── src/                  # Main application code
│   ├── components/       # Reusable UI components
│   ├── pages/            # App screens
│   ├── utils/            # Helper functions
│   ├── data/             # Product dataset (50 items)
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.ts

🛠 Tech Stack

React + TypeScript

Vite

Tailwind CSS

Supabase / Local JSON data

Lightweight image similarity algorithm

🧪 How to Run Locally
git clone <your-repo-link>
cd visual-product-finder
npm install
npm run dev


App runs at:
👉 http://localhost:5173

🌐 Deployment

Best hosting options:

Vercel (recommended)

Netlify

GitHub Pages (static version)

📘 200-Word Approach Write-Up (Assignment Requirement)

The goal of this project was to build a Visual Product Matcher capable of identifying similar products based on an uploaded image. I began by designing a clean folder structure using Vite, React, and Tailwind to ensure fast development and modular code. A dataset of 50+ products was created, each containing a name, image, category, and metadata required for similarity comparison.

For the matching system, the user first uploads an image or provides an image URL. The application displays the uploaded image and processes a similarity comparison against the dataset. A lightweight visual-similarity algorithm (pixel-based + feature comparison) is used to rank products, which are then shown with similarity scores. Users can filter the results for better control.

The UI is optimized for mobile responsiveness with Tailwind CSS. Loading states, error handling, and clean component separation were added to improve UX and code readability. The project follows the assignment guidelines by keeping dependencies minimal, avoiding unnecessary files, and ensuring the repository remains small and clean. The app can be deployed on Vercel or Netlify, and the README provides setup steps clearly.

Overall, the project demonstrates image-search logic, good frontend design practices, and clean implementation suitable for real-world use.
