# Project Report: code-alpha-ecom

## 1. Project Overview
- **Name:** `code-alpha-ecom`
- **Type:** Next.js e-commerce app
- **Purpose:** Marketplace web app with product browsing, cart, checkout, login, and AI-enhanced search.

## 2. Technology Stack
- **Framework:** `next` v16.2.10
- **React:** `react` v19.2.4
- **Styling:** `tailwindcss` v4
- **Authentication:** `next-auth` v4.24.14
- **Database:** `mongoose` + MongoDB
- **AI Search:** `openai` embeddings + fallback local TF-IDF
- **Other libraries:** `axios`, `bcryptjs`

## 3. Architecture
- App routes in `app/`
- Client pages:
  - `app/page.js`
  - `app/cart/page.js`
  - `app/checkout/page.js`
  - `app/login/page.js`
  - `app/product/[id]/page.js`
- API routes:
  - `app/api/products/route.js`
  - `app/api/ai-search/route.js`
- Shared utilities:
  - `lib/db.js`
  - `app/context/CartContext.js`
- Models:
  - `model/product.js`

## 4. Main Features
- Product listing and category filtering
- AI-powered search using OpenAI embeddings
- Shopping cart with item quantity control, remove, and clear
- Checkout page with promo code support
- Login form with optional admin mode
- Product detail page with related product recommendations
- MongoDB-backed product storage

## 5. Key Implementation Details
- `app/page.js`
  - Fetches products from `/api/products`
  - Implements search via `/api/ai-search`
  - Supports category badges and toast notifications
- `app/api/products/route.js`
  - Connects to MongoDB and returns product data
- `app/api/ai-search/route.js`
  - Performs semantic search using OpenAI embeddings if `OPENAI_API_KEY` is available
  - Falls back to TF-IDF + cosine similarity when no OpenAI key exists
- `app/product/[id]/page.js`
  - Displays product details, stock status, and related products
- `app/cart/page.js`
  - Shows cart preview, quantity updates, discount handling, and order summary
- `app/checkout/page.js`
  - Handles checkout form, order submission, and calculates tax/shipping
- `lib/db.js`
  - Mongoose database connection helper
- `model/product.js`
  - Product schema with title, description, price, category, image, and stock

## 6. Data Flow
- Frontend calls `/api/products` to list products
- Search sends query to `/api/ai-search`
- Cart state is managed in `CartContext`
- Checkout sends order payload to backend order endpoint
- MongoDB connection via `MONGO_URI`

## 7. Environment Variables
Required:
- `MONGO_URI`
- `GOOGLE_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY`

## 8. Run Commands
- `npm run dev`
- `npm run build`
- `npm start`
- `npm run lint`
- ##9.how to Run
- run on codespace of github repository
