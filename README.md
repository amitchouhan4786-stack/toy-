# 🧸 WonderToys - Online Toy Store E-Commerce Platform

A production-ready, interactive online toy store with **full REST API client**, **one-click deployment configs** (Vercel, Netlify, GitHub Pages, Express.js), and **all 8 global ways of money transaction**.

---

## 🚀 How to Run & Open the Store Instantly

Because WonderToys runs with modern zero-dependency HTML5, CSS3, and JavaScript:
1. Double-click **`index.html`** in File Explorer:
   ```
   C:\Users\HP\.gemini\antigravity\scratch\toy-store\index.html
   ```
2. Or launch directly via PowerShell:
   ```powershell
   Start-Process "C:\Users\HP\.gemini\antigravity\scratch\toy-store\index.html"
   ```

---

## 🌐 1-Click Deployment (Vercel, Netlify, GitHub Pages, Node.js)

Deployment configs are pre-packaged in the repository:

### 1. Vercel (Recommended - Global Edge Hosting with Free SSL)
- Pre-configured file: [`vercel.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/toy-store/vercel.json)
- Run in terminal:
  ```bash
  npx vercel
  ```
- Or import your GitHub repository into [Vercel](https://vercel.com/new).

### 2. Netlify (Drag & Drop or Continuous Git Deployment)
- Pre-configured file: [`netlify.toml`](file:///C:/Users/HP/.gemini/antigravity/scratch/toy-store/netlify.toml)
- Run in terminal:
  ```bash
  npx netlify deploy --prod
  ```
- Or drag the entire `toy-store` folder into [Netlify Drop](https://app.netlify.com/drop).

### 3. GitHub Pages (Automated CI/CD Workflow)
- Pre-configured workflow: [`.github/workflows/deploy.yml`](file:///C:/Users/HP/.gemini/antigravity/scratch/toy-store/.github/workflows/deploy.yml)
- Push to GitHub `main` branch; GitHub Actions automatically builds and publishes your site for free!

### 4. Self-Hosted Node.js / Express Server
- File: [`server.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/toy-store/server.js)
- Run:
  ```bash
  npm install
  npm start
  ```
  Visit: `http://localhost:3000`

---

## 💳 All 8 Ways of Money Transactions

The checkout flow features a complete multi-gateway selector:

| # | Payment Method | Gateway / Feature | Description |
|---|---|---|---|
| 1 | **Credit / Debit Cards** | Visa, MasterCard, Amex, Discover, RuPay | Live interactive 3D card preview with real-time brand detection and formatting |
| 2 | **UPI / Dynamic QR Code** | Google Pay, PhonePe, Paytm, BHIM, Cred | Generated vector QR code with instant app approval simulation and VPA copy |
| 3 | **Digital Wallets** | Apple Pay, Google Pay, PayPal Express | 1-touch express biometric checkout simulation |
| 4 | **Buy Now Pay Later (BNPL)** | Klarna, Afterpay | 4 equal interest-free bi-weekly payments schedule ($total / 4) |
| 5 | **Net Banking & Wire** | Chase, BofA, Wells Fargo, HDFC, SBI, Barclays | Direct bank gateway portal redirection simulation |
| 6 | **Web3 Cryptocurrency** | Bitcoin (BTC), Ethereum (ETH), USDT, Solana (SOL) | Live conversion calculation, deposit address, and blockchain confirmation counter |
| 7 | **Gift Card & Voucher** | WonderToys Gift Card | 16-digit card code and 4-digit security PIN balance deduction |
| 8 | **Cash on Delivery (COD)** | Doorstep Cash / Card | SMS OTP delivery verification code confirmation |

Every transaction simulates genuine gateway latency, produces an authenticated **Gateway Transaction Hash** (e.g. `TXN_STRIPE_...`, `UPI_REF_...`, `0x71C...`), and displays on the printable receipt.

---

## ⚡ REST API & Developer Explorer

WonderToys includes an interactive developer portal right on the site (`⚡ API` button in the navbar).

### Endpoints Available:
- **`GET /api/v1/products`** — Retrieve catalog with category and search query filters.
- **`GET /api/v1/products/:id`** — Retrieve single toy specifications, reviews, and stock.
- **`GET /api/v1/payment-methods`** — Query the 8 supported transaction gateways.
- **`POST /api/v1/coupons/validate`** — Verify promo code validity (`MAGIC20`, `TOY10`, `FREESHIP`).
- **`POST /api/v1/payments/create-intent`** — Generate cryptographically simulated payment intent.
- **`POST /api/v1/payments/confirm`** — Authorize payment and generate transaction hash.
- **`POST /api/v1/orders`** — Create and persist order in database.
- **`GET /api/v1/orders/:id`** — Track order fulfillment and shipment package.

---

## 📁 Repository Files

```
toy-store/
├── index.html                    # Storefront with 8 payment gateways, API explorer, and deploy assistant
├── styles.css                    # Responsive styling, interactive card preview, QR graphics, modals
├── products.js                   # 12 detailed toy products with specifications & customer reviews
├── api.js                        # Client REST API, mock gateway authorizer, and persistence layer
├── app.js                        # Application logic, checkout, audio synth, and confetti
├── server.js                     # Production Express.js server for optional Node.js hosting
├── package.json                  # Node.js project manifest
├── vercel.json                   # Zero-config deployment file for Vercel
├── netlify.toml                  # Zero-config deployment file for Netlify
├── .github/workflows/deploy.yml  # Automated CI/CD workflow for GitHub Pages
└── README.md                     # Comprehensive documentation
```
