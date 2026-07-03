# Mamta Jewellers — Full-Stack E-Commerce Site

A complete rebuild of the Mamta Jewellers website: a React storefront backed by a real
Node/Express + MongoDB API, with customer accounts, Google Sign-In, OTP-based password
recovery, a cart with WhatsApp-based product enquiries, and a full admin panel to manage
products, orders, and additional admin accounts.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, CSS Modules |
| Backend | Node.js, Express |
| Database | MongoDB (MongoDB Atlas) via Mongoose |
| Auth | JWT (email/password) + Firebase Authentication (Google Sign-In) |
| Image hosting | ImageKit (file upload + CDN delivery) |
| Email | Nodemailer via Gmail (OTP delivery for password recovery) |
| Product enquiries | WhatsApp click-to-chat (`wa.me`) links |

## Project structure

```
mamta-jewellers/
├── client/                        React storefront (Vite)
│   └── src/
│       ├── api/axios.js            axios instance — attaches JWT to every request
│       ├── firebase.js             Firebase config + Google auth provider
│       ├── context/
│       │   ├── AuthContext.jsx     login/register/adminLogin/googleLogin/
│       │   │                       updateProfile/verifyOtp, persists session to localStorage
│       │   └── CartContext.jsx     cart state, persisted to localStorage,
│       │                           auto-clears when the user logs out
│       ├── components/             Navbar, Footer, ProductCard, route guards
│       └── pages/
│           ├── Home, Collection, ProductDetail, Cart
│           ├── Login, Register, ForgotPassword (2-step: email → OTP)
│           ├── Account (tabbed dashboard: Profile / Manage Address / Order History)
│           └── admin/
│               ├── AdminLogin, AdminDashboard (stats + Add Admin modal)
│               ├── AdminProducts (CRUD + ImageKit file upload)
│               └── AdminOrders (status updates + expandable shipping address)
│
└── server/                        Node/Express API
    └── src/
        ├── config/
        │   ├── db.js               MongoDB connection
        │   ├── imagekit.js         ImageKit SDK config
        │   └── firebaseAdmin.js    Firebase Admin SDK (verifies Google ID tokens)
        ├── models/                 User, Product, Order (Mongoose)
        ├── controllers/            business logic per resource
        ├── routes/
        │   ├── authRoutes.js       register, login, admin-login, google-login,
        │   │                       forgot-password, verify-otp, profile, create-admin
        │   ├── productRoutes.js, orderRoutes.js, userRoutes.js
        │   └── uploadRoutes.js     ImageKit file upload endpoint
        ├── middleware/             JWT auth guard (protect), admin guard, error handler
        ├── utils/
        │   ├── generateToken.js    signs JWTs
        │   └── sendEmail.js        Nodemailer wrapper (used for OTP emails)
        └── seed/seed.js            seeds sample products + the first admin account
```

## Features

### Storefront
- Category browsing, product detail pages, cart (persisted in `localStorage`,
  automatically cleared on logout).
- **No online checkout/payment** — instead, the cart's "Enquire on WhatsApp" button
  opens WhatsApp with a pre-filled message listing every cart item, quantity, price,
  a link to each product's image (renders as a preview thumbnail in WhatsApp), and
  the order total. This routes all sales enquiries straight to the store's WhatsApp
  Business number for a human to close the sale.
- Guests are redirected to login before adding to cart or buying, so every enquiry is
  tied to a real account.

### Customer accounts
- Email/password registration and login (JWT-based sessions, stored in `localStorage`).
- **Google Sign-In** via Firebase Authentication — one-tap login/signup; new Google
  users are auto-created as customers on first sign-in.
- **Forgot password (OTP flow):** enter email → a 6-digit OTP is emailed via
  Nodemailer/Gmail (10-minute expiry, hashed at rest) → entering the correct OTP logs
  the user straight in (customers land on the homepage, admins land on `/admin`).
- **Account dashboard** (`/account`) with three tabs:
  - **Profile** — update name and phone number.
  - **Manage Address** — save a default shipping address, reused automatically on
    future orders with a "use a new address" override.
  - **Order History** — past orders with status badges.

### Admin panel
- Separate admin login at `/admin/login` (same OTP-based forgot-password flow).
- **Dashboard** — live stats (products, orders, pending orders, revenue) and an
  **"+ Add Admin"** modal so new admin accounts can be created directly from the UI —
  no need to re-run the seed script after the first admin exists.
- **Products** — full CRUD with **direct image upload to ImageKit** (drag a file in,
  it's uploaded and CDN-hosted automatically — no manual URL pasting).
- **Orders** — update order status (Placed → Confirmed → Shipped → Delivered /
  Cancelled), and expand any row to see the customer's full shipping address and
  contact phone for fulfillment.

### Design
- Crimson & gold design system (Playfair Display for headings, Inter for body text),
  fully responsive down to mobile.

## Environment variables

### `server/.env`

```dotenv
# MongoDB connection string (MongoDB Atlas or local)
MONGO_URI=

# Secret used to sign JWT tokens — use a long random string
JWT_SECRET=

# Port the API server listens on
PORT=5000

# ImageKit credentials (Dashboard → Developer Options → API Keys)
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Comma-separated list of origins allowed to call the API
CLIENT_URL=http://localhost:5173

# Credentials used by the one-time seed script to create the first admin account
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Nodemailer — used to send OTP emails for password recovery
# Must be a Gmail App Password (requires 2-Step Verification enabled on the account),
# not the regular account password.
EMAIL_USER=
EMAIL_PASS=
```

Firebase Admin also requires a **service account key file** — download it from
Firebase Console → Project Settings → Service Accounts → Generate new private key,
and save it as `server/src/config/firebaseServiceAccount.json`. This file is a secret
and must stay out of version control.

### `client/.env`

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Firebase's web config (`apiKey`, `authDomain`, `projectId`, etc.) lives directly in
`client/src/firebase.js`. These values are public identifiers (safe to commit) —
the real secret is the backend's service account key above.

### Files that must stay out of git

Confirm both are listed in `.gitignore` before your first commit:
```
server/.env
server/src/config/firebaseServiceAccount.json
client/.env
```

## Prerequisites

- Node.js 18+
- A MongoDB database — [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or
  a local install
- An [ImageKit](https://imagekit.io) account (free tier)
- A Gmail account with **2-Step Verification** enabled, and an
  [App Password](https://myaccount.google.com/apppasswords) generated for it

## 1. Backend setup

```bash
cd server
npm install
# create .env using the template above, filling in real values
# place firebaseServiceAccount.json in src/config/

npm run seed   # creates 8 sample products + one admin account
npm run dev    # starts the API on http://localhost:5000
```

The seed script uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` to create the first
admin. After that, use the **"+ Add Admin"** button inside the Admin Dashboard to
create any further admin accounts — the seed script only needs to run once.

## 2. Frontend setup

In a second terminal:

```bash
cd client
npm install
# create .env using the template above

npm run dev    # starts the storefront on http://localhost:5173
```

Visit `http://localhost:5173` for the storefront, and `http://localhost:5173/admin/login`
for the admin panel.

## 3. Building for production

```bash
cd client && npm run build     # outputs static files to client/dist
cd server && npm start         # run the API with a process manager (pm2, etc.) in production
```

Recommended free hosting combo:
- **Frontend (`client/`)** → [Vercel](https://vercel.com) — set `VITE_API_URL` to your
  deployed backend URL as an environment variable before building.
- **Backend (`server/`)** → [Render](https://render.com) — set all the `server/.env`
  variables above as environment variables in the Render dashboard, and upload the
  Firebase service account contents as a secret file or an environment variable
  (Render supports "Secret Files" for exactly this).
- **Database** → MongoDB Atlas is already cloud-hosted — just make sure the deployed
  backend's IP is allowed under Atlas → Network Access (or use `0.0.0.0/0` for
  simplicity).

After both are deployed, update `CLIENT_URL` in the backend's environment variables
to the live frontend URL (for CORS), and `VITE_API_URL` in the frontend to the live
backend URL, then redeploy the frontend.

## Notes for the client

- **No online payment gateway is wired up.** Customers place items in the cart and
  tap "Enquire on WhatsApp," which opens a pre-filled WhatsApp message (including
  item names, quantities, prices, an image link per item, and the total) addressed
  to the store's WhatsApp Business number. Closing the sale, quoting final price,
  and arranging payment/delivery happens over WhatsApp, human-to-human. If online
  payments are wanted later (e.g. Razorpay), that can be added as a separate feature.
- Product images are uploaded directly from the Admin → Products form and stored on
  ImageKit's CDN — no manual URL pasting required.
- Change the seeded admin password immediately after your first login, and rotate
  any credentials that were ever shared outside of `.env` files (database password,
  JWT secret, admin password, email app password).
- The WhatsApp number the enquiry button messages is hardcoded in
  `client/src/pages/Cart/Cart.jsx` (`WHATSAPP_NUMBER` constant, format:
  country code + number, no `+` or spaces) — update it if the business number changes.
