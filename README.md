# RONA ELEMENTRA

A premium, modern, and chic e-commerce storefront built with React, Vite, and Tailwind CSS. The application features a sophisticated editorial aesthetic, smooth animations, and a fully responsive design tailored for high-end fashion brands.

## 🌟 Features

- **Premium UI/UX:** A highly refined, minimalist, and editorial design language.
- **Dynamic Routing:** Seamless navigation using `react-router-dom` across multiple pages (Home, Store, Collections, About, Profile, Cart).
- **Modern Styling:** Powered by Tailwind CSS (v4) with global Urbanist typography.
- **Micro-Animations:** Fluid transitions and dynamic text reveals using Framer Motion and native CSS transitions.
- **Dynamic Category Filtering:** Easily filter products by category (Clothes, Curtains, Bags, Dress) in both the store and admin dashboard.
- **Intelligent Inventory Management:** Conditional sizing logic that automatically disables size options for specific categories like "Curtains".
- **Responsive Layout:** Optimized for mobile, tablet, and desktop viewing.
- **Component-Based Architecture:** Modular React components for easy maintenance and scalability.

## 🚀 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 📂 Project Structure

```text
rona/
├── public/               # Static assets
├── src/
│   ├── assets/           # Local images and media
│   ├── components/       # Reusable UI components (Navbar, Footer, Hero, etc.)
│   ├── pages/            # Route components (HomePage, StorePage, CollectionsPage, etc.)
│   ├── App.jsx           # Main application router
│   ├── index.css         # Global styles and Tailwind configuration
│   └── main.jsx          # React entry point
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd Rona/rona
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` to view the application in action.

## 🎨 Design Philosophy

Rona Elementra embraces a "less is more" approach, focusing on:
- **Typography:** Utilizing the Urbanist font for a clean, modern, and highly legible appearance.
- **Color Palette:** A sophisticated mix of deep contrasting darks (Graphite/Black), stark whites, and subtle indigo accents for calls to action.
- **Imagery:** Large, editorial-style image blocks that prioritize product presentation and brand storytelling.
- **Space:** Abundant negative space to let the content breathe and create a feeling of luxury.

## 📄 Pages Included

- **Home (`/`):** The storefront entry point featuring a dynamic hero section and latest arrivals.
- **Store (`/store`):** The full product catalog with responsive grids and search functionality.
- **Collections (`/collections`):** An elegant, editorial lookbook showcasing curated fashion lines.
- **About (`/about`):** The brand's story, highlighting sustainability and radical transparency.
- **Profile (`/profile`):** A mock-up of a user account dashboard displaying settings and preferences.
- **Cart (`/cart`):** A fully functional shopping cart interface with live subtotal/tax calculations.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Designed with precision for the modern web.*
