# 🌾 Bole Animal Feed Processing — Official Website

Full-stack web application for **Bole Animal Feed Processing PLC**, Addis Ababa, Ethiopia.

---

## 📦 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS      |
| Backend  | Node.js + Express.js                |
| Database | NeDB (embedded, no setup needed)    |
| Auth     | JWT (JSON Web Tokens)               |
| Charts   | Recharts                            |

---

## 🚀 Quick Start

### 1. Install & Build (First time only)
```bash
npm run setup
```

### 2. Start the Server
```bash
npm start
```

Then open: **http://localhost:5000**

---

## 🔐 Admin Login

Go to: `http://localhost:5000/admin/login`

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | bole2024  | Admin |
| staff    | staff123  | Staff |

> ⚠️ Change passwords after first login via **Settings → Change Password**

---

## 🌐 Public Pages

| Page            | URL              | Description                        |
|-----------------|------------------|------------------------------------|
| Home            | `/`              | Landing page with hero + featured products |
| Products        | `/products`      | Full product catalog with filters  |
| Product Detail  | `/products/:id`  | Specs + online order form          |
| About Us        | `/about`         | Company info, mission, vision      |
| Contact         | `/contact`       | Contact form + phone/address       |
| Track Order     | `/track`         | Order status tracker               |

---

## 🛠️ Admin Dashboard

| Section    | URL                   | Features                                          |
|------------|-----------------------|---------------------------------------------------|
| Dashboard  | `/admin`              | Live stats, sales charts, recent orders           |
| Orders     | `/admin/orders`       | View, search, filter, update order status/payment |
| Products   | `/admin/products`     | Add/edit/delete products, toggle visibility       |
| Messages   | `/admin/messages`     | Read customer messages, save notes, mark replied  |
| Inventory  | `/admin/inventory`    | Stock levels, manual adjustments, activity log    |
| Batches    | `/admin/batches`      | Production batch records, expiry tracking         |
| Reports    | `/admin/reports`      | Sales charts, revenue, product performance        |
| Users      | `/admin/users`        | Create/delete staff accounts (admin only)         |
| Settings   | `/admin/settings`     | Company info, working hours, change password      |

---

## 📁 Project Structure

```
bole-fullstack/
├── server/
│   ├── data/              # Auto-created database files
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js        # Login, me, change password
│   │   ├── products.js    # Product CRUD
│   │   ├── orders.js      # Order management
│   │   └── misc.js        # Messages, inventory, batches, dashboard, users, settings
│   ├── db.js              # Database init + seed data
│   ├── index.js           # Express server entry point
│   └── .env               # Environment variables
│
└── client/
    └── src/
        ├── api/           # Axios client
        ├── components/
        │   └── layout/    # Navbar, Footer, AdminLayout
        ├── context/       # Auth context
        └── pages/
            ├── public/    # Home, Products, About, Contact, Track
            └── admin/     # Dashboard, Orders, Products, Messages,
                           # Inventory, Batches, Reports, Users, Settings
```

---

## 🏭 Company Info

**Bole Animal Feed Processing PLC**
- 📍 Bole Michael, Addis Ababa, Ethiopia
- 📞 +251 939 277 772 / +251 939 377 773 / +251 711 277 771
- ⏰ Mon–Sat: 8:00 AM – 6:00 PM | Sun: 9:00 AM – 1:00 PM

---

## 📦 Products

| Product              | Category    | Target           | Price     |
|----------------------|-------------|------------------|-----------|
| Layer Super Phase 1  | Layer Feed  | 18–45 weeks      | 2,800 ETB |
| Layer Super Phase 2  | Layer Feed  | 46+ weeks        | 2,700 ETB |
| Broiler Starter      | Broiler Feed| 0–3 weeks        | 3,100 ETB |
| Broiler Finisher     | Broiler Feed| 4–7 weeks        | 2,950 ETB |
| Dairy Cattle Feed    | Dairy Feed  | Lactating cows   | 2,200 ETB |

---

## 🔧 Environment Variables (server/.env)

```env
PORT=5000
JWT_SECRET=your_secret_key_here_change_this
NODE_ENV=production
```

---

## 🌍 Deployment

For production deployment:
1. Set `NODE_ENV=production` in `.env`
2. Change `JWT_SECRET` to a long random string
3. Run `npm run setup` then `npm start`
4. Use a process manager like PM2: `pm2 start server/index.js --name bole-feed`
5. Optionally use Nginx as a reverse proxy on port 80/443

---

*Built for Bole Animal Feed Processing PLC — Quality Feed for Better Results 🇪🇹*
