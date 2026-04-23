# 🛒 SmartGroc – Smart Grocery Management System

## 📌 Overview

SmartGroc is a role-based smart grocery management system designed to reduce product waste and improve shop efficiency using intelligent inventory tracking, dynamic pricing, and analytics.

The system simulates a complete quick-commerce ecosystem including customer shopping, shop management, delivery tracking, and admin control.

---

## 🚀 Features

### 👤 Customer

* Browse shops and products
* Smart discounts based on expiry
* Add to cart & place orders
* Multiple payment methods (Card, UPI, COD – simulated)
* Order tracking with delivery status

---

### 🏪 Shopkeeper

* Add/Edit/Delete products
* Inventory management
* Expiry tracking system
* Smart suggestions (discount, restock, promotion)

---

### 🚚 Delivery Partner

* Accept delivery requests
* Track delivery status
* Update order progress (Picked → Delivered)
* View earnings and stats

---

### 🛠️ Admin

* Manage users and shops
* Approve or delete shops
* Monitor system analytics
* Track delivery performance

---

## 🧠 Smart Features (Core Highlights)

* 📅 Expiry Detection System
* 💸 Dynamic Discount Calculation
* 📊 Analytics Dashboard (Revenue, Profit, Waste)
* 📦 Smart Inventory Insights
* 🧾 Expense Tracking System
* 🛍️ Personalized Offers
* 🚦 Rush Hour Indicator
* 🤖 Rule-based AI-like decision suggestions

---

## 🏗️ Tech Stack

### Frontend

* React (TypeScript)
* Vite
* Tailwind CSS
* ShadCN UI + Radix UI

### State Management

* Context API

### Data Storage

* LocalStorage (for persistence)

### Charts & Visualization

* Recharts

### Testing

* Vitest (basic setup)

---

## 📂 Project Structure

```
src/
 ├── components/     → Reusable UI components  
 ├── context/        → Global state management  
 ├── data/           → Dummy data  
 ├── features/       → Feature logic  
 ├── hooks/          → Custom hooks  
 ├── integrations/   → External configs (Supabase)  
 ├── pages/          → Application pages  
 ├── types/          → Type definitions  
 ├── test/           → Test files  
```

---

## ▶️ How to Run the Project

### 1. Install dependencies

npm install

### 2. Start development server

npm run dev

### 3. Open in browser

http://localhost:8080/

---

## 💾 Data Storage

* The project uses **localStorage** to store:

  * Users
  * Cart items
  * Orders
  * Products
  * Expenses

👉 View data in:
DevTools → Application → Local Storage

---

## 💳 Payment System

* Simulated payment system
* Supports:

  * Card
  * UPI
  * Cash on Delivery

👉 COD orders are marked as **pending**, not instant success

---

## 🔮 Future Scope

* Backend integration (Supabase / Firebase)
* Real payment gateway (Stripe / Razorpay)
* Real-time notifications
* AI-based demand prediction
* Mobile application version

---

## ⚠️ Limitations

* No real backend (uses localStorage)
* Dummy payment system
* No authentication security

---

## 🎯 Project Objective

To build a smart grocery system that:

* Reduces product waste
* Improves business decision-making
* Enhances customer experience

---

## ⭐ Conclusion

SmartGroc demonstrates how modern frontend technologies can simulate a full-scale smart retail ecosystem with intelligent features and role-based architecture.

---
