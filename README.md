# 📦 StockMaster — Inventory Management System (MERN)

StockMaster is a **MERN-based Inventory Management System (IMS)** designed to digitize and streamline stock operations for businesses. It replaces manual registers and Excel sheets with a **centralized, real-time, role-based** inventory control platform.

---

## 🚀 Features

### 🔐 Authentication & Access Control
- Secure login & signup  
- OTP-based password reset  
- Role-based workflows for Inventory Managers and Warehouse Staff  

### 📊 Dashboard & KPIs
- Total products in stock  
- Low-stock / out-of-stock alerts  
- Pending receipts & deliveries  
- Scheduled internal transfers  
- Multi-warehouse overview  

### 🧭 Dynamic Filters
Filter inventory records by:
- Document type: Receipts / Delivery / Internal / Adjustments  
- Status: Draft, Waiting, Ready, Done, Canceled  
- Warehouse or location  
- Product category  

### 🏷️ Core Modules
- **Product Management** (Name, SKU, Category, UoM, Initial Stock)  
- **Receipts (Incoming Stock)** with auto stock increments  
- **Delivery Orders (Outgoing Stock)** with auto decrements  
- **Internal Transfers** across warehouses or racks  
- **Stock Adjustments** to fix mismatches  
- **Move History & Stock Ledger** for full traceability  

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Auth:** JWT, OTP email service  
**Tools:** Postman, GitHub  

---


📌 Inventory Workflow (Simplified)

Receive Goods → Stock increases

Move Internally → Location changes, total remains same

Deliver Goods → Stock decreases

Adjust Mismatches → Physical vs recorded differences corrected

---

[▶️ Watch Demo Video](https://drive.google.com/file/d/175akAXOYGFFyfv7Tz6aWYdLbFSvjEbPS/view?usp=sharing)
