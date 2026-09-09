# OPD & Medicine Inventory System

## Tech Stack
**MERN** (React/Vite, Express, MongoDB) | **Roles:** `admin`, `nurse`

---

## Core Modules

| Module | Purpose |
|--------|---------|
| **Auth** | Login, JWT cookie, RBAC |
| **Dashboard** | Stats, recent OPD, complaints |
| **Medicines** | Inventory, batches, stock, expiry |
| **Stock Bills** | Purchases → stock addition |
| **OPD** | Patients, prescriptions, medicine usage |
| **Expiry/Scrap** | Expired/near-expiry batches, removal |

---

## Access Control

| Role | Access |
|------|--------|
| **Admin** | Full access: inventory, stock bills, OPD, expiry, scrap, users |
| **Nurse** | OPD + medicine usage only |

---

## Architecture
```
Route → Middleware → Controller → Service → Model
```

## Authentication
- JWT in **HTTP-only cookie** only (never localStorage)
- Protected APIs require auth; wrong role → `403`

## Response Format
```js
// Success
{ success: true, message: "Success", data: {} }

// Error  
{ success: false, message: "Error", errors: [] }
```

**Status Codes:** `200` · `201` · `400` · `401` · `403` · `404` · `409` · `500`

---

## Data Models

### User
```
username (req, unique) | email (opt) | password (bcrypt) | role (admin|nurse)
```
- Never return password
- Admin-only management

### Medicine
```
name (req) | genericName | category | unit (req) | batches[] | totalStock (derived) | reorderLevel
```

### Batch (embedded in Medicine)
```
batchNumber (req) | quantity (≥0) | purchasePrice (≥0) | sellingPrice (≥0) | expiryDate (req)
```

### StockBill
```
billNumber (req, unique) | supplierName (req) | billDate (req) | items[] (≥1) | subtotal (derived) | notes | createdBy → User
```

### BillItem (embedded)
```
medicine → Medicine | batchNumber | expiryDate | quantity (>0) | purchasePrice (≥0) | total (derived)
```

### Patient
```
patientId (req, unique, auto) | name (req) | age (≥0) | gender | phone | address | complaints | diagnosis | prescription[] | notes | createdBy → User | visitDate (req)
```

### Prescription (embedded)
```
medicine → Medicine | quantity (>0) | dosage | frequency | duration | instructions
```

### ScrapRecord
```
medicine → Medicine | batchNumber | quantity (>0) | reason | expiryDate | scrappedBy → User | scrappedAt
```

---

## Business Rules

### Stock Rules (Critical - Never Violate)
- `totalStock = sum(batch.quantity)` (always match)
- Stock **never negative**
- Expired batches cannot be dispensed
- Zero-stock medicines remain unless deleted
- Use **FEFO** (earliest expiry first)

### Stock Bill Flow (Atomic)
```
Validate → Find/Create Medicine → Add Batch → Recalculate Stock → Save Bill
```
- Bill number unique, ≥1 item, quantity >0, prices ≥0
- Missing medicine may be auto-created
- Stock increases automatically

### OPD Flow (Atomic)
```
Validate Patient → Validate ALL Medicines → Check Stock → Deduct Batches → Recalculate Stock → Save OPD
```
- All medicines must exist & have sufficient stock
- If any fails → **entire operation fails**
- Use DB transaction where possible

### Scrap Flow (Atomic)
```
Validate Batch → Validate Quantity → Deduct Batch → Recalculate Stock → Create ScrapRecord
```
- Quantity >0 and ≤ available
- Scrapped stock cannot be dispensed later
- Historical scrap record preserved

### Expiry Status
| Status | Rule |
|--------|------|
| Expired | `expiryDate < today` |
| Near Expiry | Within 30 days (configurable) |
| Valid | Beyond threshold |

---

## Relationships
```
User → StockBill.createdBy, Patient.createdBy, ScrapRecord.scrappedBy
Medicine → batches[], Prescription.medicine, StockBill.items[].medicine, ScrapRecord.medicine
Patient → Prescription[] → Medicine
```

---

## Search/Filter/Pagination

| Module | Supported Queries |
|--------|-------------------|
| Medicines | `search`, `category`, `stockStatus`, `expiryStatus`, `page`, `limit` |
| OPD | `search`, `date`, `page`, `limit` |
| Stock Bills | `search`, `supplier`, `date`, `page`, `limit` |
| Expiry | `search`, `status`, `page`, `limit` |

- Search: patient ID/name/phone, medicine name/generic name
- Pagination at DB level with metadata

---

## Validation (Server-Side Mandatory)
- Required fields, data types, numbers/ranges
- ObjectIds, enums, dates, quantities
- Duplicate IDs, stock availability
- **Never trust client-calculated totals/stock**

---

## Dashboard Statistics
- Total Patients, Medicines
- Expired/Near-expiry Medicines/Batches
- Low-stock Medicines (`totalStock ≤ reorderLevel`)
- Recent OPD Entries
- Complaint Frequency (aggregated from OPD)

---

## Medicine Deletion
- Check OPD/prescription references & stock/batches first
- **Prefer soft delete** for historical traceability

---

## API Routes

### Auth
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Dashboard
```
GET /api/dashboard/stats
GET /api/dashboard/recent-opd
GET /api/dashboard/complaints
```

### Medicines
```
POST   /api/medicines
GET    /api/medicines
GET    /api/medicines/:id
PATCH  /api/medicines/:id
DELETE /api/medicines/:id
```

### Stock Bills
```
POST /api/stock-bills
GET  /api/stock-bills
GET  /api/stock-bills/:id
```

### OPD
```
POST /api/opd
GET  /api/opd
GET  /api/opd/:id
```

### Expiry/Scrap
```
GET  /api/expiry/expired
GET  /api/expiry/near
POST /api/expiry/scrap
GET  /api/expiry/scrap-records
```

---

## Critical Data Rules (Never Violate)
- Backend is authoritative for stock
- Stock never negative
- No expired medicine in OPD
- OPD/Stock/Scrap operations must be **atomic**
- `totalStock` must match batch quantities
- Preserve historical records
- Business logic in **Services**, not controllers
- No duplicated stock calculations
- No unnecessary abstractions/features