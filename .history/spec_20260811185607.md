# SPEC.md

# 1. PROJECT

Clinic OPD Management System

Purpose:
Manage OPD entries, medicine inventory, stock purchases and expiry tracking.

Users:

* Nurse
* Admin

---

# 2. BUSINESS RULES

Patient Entry:

* Medicines reduce stock automatically.
* Stock cannot go below 0.

Stock Bills:

* Add stock automatically.
* Create medicine if not found.

Expiry:

* Expired batches appear automatically.
* Scrap moves record to ScrapRecord.
* Scrapped stock becomes 0.

Authentication:

* JWT in HTTP-only cookies.
* No localStorage tokens.

---

# 3. MODULES

## Dashboard (/)

Shows:

* Total Patients
* Total Medicines
* Expired Medicines
* Near Expiry Medicines
* Low Stock Medicines
* Recent Activity
* Quick Actions

---

## OPD (/opd)

Patient Form:

* Patient Information
* Clinical Details
* Prescription Details
* Review & Submit

Patient Table:

* Search
* Filters
* Pagination
* View Details

---

## Medicines (/medicines)

* Inventory List
* Search
* Filters
* Add Medicine
* Edit Medicine
* Delete Medicine

---

## Stock Bills (/stock)

* Create Bill
* View Bills
* Auto Stock Addition

---

## Expiry Management (/expiry)

* Expired Batches
* Near Expiry
* Scrapped Records
* Scrap Action

---

# 4. DATA MODELS

User

* username
* password
* role

Patient

* patientInfo
* clinicalDetails
* medicinesGiven
* entryDate

Medicine

* name
* unit
* batches[]
* totalStock

StockBill

* billNumber
* supplier
* items[]
* grandTotal

ScrapRecord

* medicineName
* batchNumber
* quantity
* supplier
* scrappedDate

---

# 5. API MODULES

Auth

* Login
* Logout
* Me

Patients

* List
* Create
* View

Medicines

* List
* Create
* Update
* Delete

Stock

* List Bills
* Create Bill
* View Bill

Expiry

* Expired
* Near Expiry
* Scrapped
* Scrap Batch

Dashboard

* Stats

---

# 6. TECHNICAL REQUIREMENTS

Frontend:

* React
* Vite
* Tailwind

Backend:

* Node.js
* Express

Database:

* MongoDB

Authentication:

* HTTP-only Cookies

Search:

* Debounced Search

Pagination:

* page
* limit

---

# 7. SUCCESS CRITERIA

✓ Login works

✓ Patient creation works

✓ Stock deduction works

✓ Stock bill creation works

✓ Expiry detection works

✓ Scrap workflow works

✓ Dashboard stats work

✓ Search and pagination work
