# 💳 BillMate (Frontend Web Application)

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![i18next](https://img.shields.io/badge/i18n-Multi--Language-26A69A)](https://www.i18next.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **BillMate** is a modern, responsive web application for group expense tracking, smart bill splitting, debt settlements, and group collaboration. Built with **React 18**, **Tailwind CSS**, and **Vite**, featuring full multi-language and RTL support (Arabic, English, Turkish).

🔗 **Backend Repository:** [BillMate-Backend (.NET 8 REST API)](https://github.com/Husam-Abdulraheem/BillMate-Backend)

---

## 🚀 Standalone Interactive Demo Mode

This repository comes equipped with an **in-browser Mock Engine (`demoStore`)**:
- **Zero Server Costs:** No live backend server is required to test or showcase the app.
- **1-Click Demo Login:** Instantly explore the app as an active user with pre-loaded mock groups, debts, and bills.
- **Local Persistence:** Adding bills, making payments, and settling balances dynamically recalculate and persist in `localStorage`.
- **Full Offline & Deployment Ready:** Can be deployed to **Vercel**, **Netlify**, or **GitHub Pages** with $0 maintenance.

---

## ✨ Features & Capabilities

- **📱 Responsive Mobile-First Design:** Optimized for smartphones, tablets, and desktop browsers with fluid swipe interactions.
- **🌐 Trilingual & RTL Native:**
  - Arabic (العربية - RTL)
  - English (LTR)
  - Turkish (Türkçe - LTR)
- **👥 Group Collaboration:**
  - Dynamic QR Code generation for seamless group invitations.
  - Integrated QR camera scanner (`@zxing/library`).
  - Member management and permission handling.
- **📊 Real-Time Financial Overview:**
  - Automated debt & receivable calculation with animated counter effects.
  - Settle debts between members with receipt attachment viewing.
- **📝 Form Validation & Security:**
  - Built with **Formik** and **Yup** schema validation for robust inputs.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component architecture & hooks |
| **Vite 5** | Ultra-fast HMR build tooling |
| **Tailwind CSS** | Utility-first responsive design & custom theme |
| **react-i18next** | Internationalization & RTL layout switching |
| **Formik & Yup** | Schema-driven form handling & validation |
| **@headlessui/react** | Accessible UI dialogs, modals & menus |
| **@zxing/library & qrcode.react** | QR code scanning and rendering |
| **Axios** | HTTP client with pluggable Mock Engine |

---

## 📂 Project Architecture

```
src/
├── assets/             # Vector illustrations, icons, animations & videos
├── components/
│   ├── alerts/         # Toast notifications, loaders & tooltips
│   ├── bills/          # Bill card views (MyBills, Archived, Settlements)
│   ├── dialogs/        # Modals (AddBill, PayBill, Settle, JoinGroup, Filter)
│   ├── layout/         # Header, Footer, navigation wrappers
│   ├── pages/          # Main application screens (MainPage, BillsPage, GroupPage, Profile)
│   └── QRComponent/    # QR generator and webcam scanner
├── helpers/
│   ├── APIs/           # Modular API clients (Bills, Group, Profile, User, Subscription)
│   ├── Contexts/       # React Contexts (GroupContext, ProfileContext)
│   └── demoMockStore.js# Client-side Mock Engine for zero-backend live demo
└── translations/       # JSON localization dictionaries (ar, en, tr)
```

---

## 🏁 Quickstart (Local Development)

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Husam-Abdulraheem/BillMate-Frontend.git
cd BillMate-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** By default, `appConfig.IS_DEMO_MODE` is set to `true`, allowing immediate testing with mock data. If connecting to a live backend, set `VITE_API_URL` in `.env` and switch `IS_DEMO_MODE` to `false`.

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
