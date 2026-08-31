# TASKS.md

# PHASE 0 - FOUNDATION

## Slice 0.1 Project Setup

* [x] Create server folder structure
* [x] Create client folder structure
* [x] Setup Express server
* [x] Setup React + Vite
* [x] Setup Tailwind CSS
* [x] Setup environment variables
* [x] Setup gitignore

Done When:

* Server starts
* Client starts
* Tailwind works

---

## Slice 0.2 Database

* [x] Configure MongoDB connection
* [x] Create db connection utility
* [x] Setup connection logging
* [x] Handle connection errors

Done When:

* Database connects successfully
* Server exits gracefully on failure

---

## Slice 0.3 Core Infrastructure

* [x] Global error handler
* [x] Async error wrapper
* [x] Response helpers
* [x] Cookie parser
* [x] CORS configuration
* [x] Basic API structure

Done When:

* Errors return consistent format
* APIs can return success/error responses

---

# PHASE 1 - AUTHENTICATION

## Slice 1.1 User Model

* [x] Create User model
* [x] Password hashing
* [x] Role support (admin/nurse)

Done When:

* Users can be stored securely

---

## Slice 1.2 Login API

* [x] Create login route
* [x] Create login controller
* [x] Create auth service
* [x] Validate credentials in service
* [x] Generate JWT in service
* [x] Set HTTP-only cookie in controller/response flow
* [x] Return user info + success response

Done When:

* Login returns cookie

---

## Slice 1.3 Frontend Login

* [ ] Create Login page
* [ ] Create auth service
* [ ] Create protected routes
* [ ] Create auth context

Done When:

* User can login
* Protected pages work

---

## Slice 1.4 Auth Middleware and Logout

* [x] Add JWT auth middleware for protected routes
* [x] Validate token on every protected request
* [x] Remove raw token from login response and keep cookie-only auth
* [x] Add logout endpoint to clear auth cookies
* [x] Add role-based access for admin and nurse routes
* [x] Ensure error middleware is registered after routes and does not call next() after sending the response

Done When:

* Protected APIs validate auth before processing requests
* Logout works correctly
* Admin and nurse roles are enforced correctly
* Error middleware is placed correctly and does not double-handle errors

---

# PHASE 2 - DASHBOARD

## Slice 2.1 Dashboard Stats API

* [x] Dashboard route
* [x] Dashboard controller
* [x] Aggregate statistics

Return:

* Total Patients
* Total Medicines
* Expired Medicines
* Near Expiry
* Low Stock

Done When:

* Stats endpoint returns data

---

## Slice 2.2 Dashboard UI

* [x] Create Dashboard page
* [x] Create stat cards
* [x] Create quick actions
* [x] Create recent activity section

Done When:

* Dashboard displays real data

---

# PHASE 3 - MEDICINE INVENTORY

## Slice 3.1 Medicine Model

* [ ] Create Medicine model
* [ ] Create Batch schema
* [ ] Auto totalStock calculation

Done When:

* Medicines can be stored

---

## Slice 3.2 Medicine APIs

* [ ] Create medicine
* [ ] Update medicine
* [ ] Delete medicine
* [ ] Search medicines
* [ ] Pagination
* [ ] Filters

Done When:

* Inventory CRUD works

---

## Slice 3.3 Medicines Page

* [ ] Inventory table
* [ ] Search
* [ ] Filters
* [ ] Add modal
* [ ] Edit modal
* [ ] Delete action

Done When:

* Inventory fully manageable

---

# PHASE 4 - STOCK BILLS

## Slice 4.1 Stock Bill Model

* [ ] Create StockBill model
* [ ] Bill number generator

Done When:

* Bills can be stored

---

## Slice 4.2 Stock Bill APIs

* [ ] Create bill endpoint
* [ ] Auto stock addition
* [ ] Create medicine if missing
* [ ] Bill listing
* [ ] Bill details

Done When:

* Inventory updates from bills

---

## Slice 4.3 Stock Bills UI

* [ ] Bills sidebar
* [ ] Bill form
* [ ] Bill summary
* [ ] Bill viewer

Done When:

* Bills can be created from UI

---

# PHASE 5 - OPD MANAGEMENT

## Slice 5.1 Patient Model

* [ ] Create Patient model
* [ ] Prescription schema
* [ ] Validation rules

Done When:

* Patients can be stored

---

## Slice 5.2 Patient APIs

* [ ] Create patient
* [ ] Validate stock
* [ ] Deduct stock
* [ ] List patients
* [ ] Search patients
* [ ] Pagination
* [ ] View patient

Done When:

* OPD entries work end-to-end

---

## Slice 5.3 OPD Page

* [ ] Patient form
* [ ] Medicine selection
* [ ] File upload
* [ ] Patient table
* [ ] Search
* [ ] Pagination

Done When:

* Nurse can create OPD entries

---

# PHASE 6 - EXPIRY MANAGEMENT

## Slice 6.1 Expiry APIs

* [ ] Expired batches endpoint
* [ ] Near expiry endpoint
* [ ] Scrap endpoint
* [ ] Scrap record creation

Done When:

* Expiry workflow functions

---

## Slice 6.2 Expiry UI

* [ ] Expired tab
* [ ] Near expiry tab
* [ ] Scrapped tab
* [ ] Search
* [ ] Scrap action

Done When:

* Expiry management complete

---

# PHASE 7 - POLISH

## Slice 7.1 UX Improvements

* [ ] Loading states
* [ ] Empty states
* [ ] Error states
* [ ] Toast notifications

---

## Slice 7.2 Testing

* [ ] Login flow
* [ ] Stock deduction
* [ ] Stock addition
* [ ] Expiry detection
* [ ] Scrap workflow
* [ ] Dashboard statistics

---

## Slice 7.3 Production Readiness

* [ ] Environment review
* [ ] Security review
* [ ] Seed admin user
* [ ] Deployment setup

Done When:

* Application ready for production demo
