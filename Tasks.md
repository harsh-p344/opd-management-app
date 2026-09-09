# Project Tasks

## Foundation

### 0.1 Project setup

- [x] Server structure
- [x] Client structure
- [x] Express server
- [x] React and Vite
- [x] Tailwind CSS
- [x] Environment variables
- [x] Gitignore

Done when: Server, client, and Tailwind start successfully.

### 0.2 Database

- [x] MongoDB connection
- [x] Database utility
- [x] Connection logging
- [x] Connection failure handling

Done when: The database connects and failures are handled safely.

### 0.3 Core infrastructure

- [x] Global error handler
- [x] Async error wrapper
- [x] Response helpers
- [x] Cookie parser
- [x] CORS configuration
- [x] API structure

Done when: Responses and errors use a consistent format.

## Authentication

### 1.1 User model

- [x] User model
- [x] Password hashing
- [x] Admin and nurse roles

Done when: Users are stored securely and roles are validated.

### 1.2 Login API

- [x] Login endpoint
- [x] Credential validation
- [x] JWT authentication
- [x] HTTP-only auth cookie
- [x] User response

Done when: Valid login succeeds and invalid credentials return an error.

### 1.3 Frontend login

- [x] Login page
- [x] Login form and validation
- [x] Auth service
- [x] Auth context
- [x] Protected route

Done when: Login works end to end and protected pages require authentication.

### 1.4 Auth middleware and logout

- [x] JWT middleware
- [x] Protected route validation
- [x] Cookie-only authentication
- [x] Logout endpoint
- [x] Role-based access
- [x] Centralized auth errors

Done when: Protected APIs, logout, and admin/nurse permissions work correctly.

## Dashboard

### 2.1 Dashboard stats API

- [x] Dashboard route
- [x] Dashboard controller
- [x] Aggregate statistics
- [x] Patient count
- [x] Medicine count
- [x] Expired medicine count
- [x] Near-expiry count
- [x] Low-stock count

Done when: The stats endpoint returns accurate data.

### 2.2 Dashboard UI

- [x] Dashboard page
- [x] Stat cards
- [x] Quick actions
- [x] Recent activity section
- [x] Loading and error states

Done when: The dashboard displays live data.

### 2.3 Dashboard Rebuild

- [ ] Structure: Layout → Sidebar + Header + MainContent
- [ ] Top: 4 StatCards for key metrics
- [ ] Bottom: Recent OPD Entries + Complaint Frequency
- [ ] UX: API-ready data, actions, loading/empty/error states
- [ ] Responsive: Desktop/tablet/mobile layouts and navigation
- [ ] Design: Premium futuristic UI, restrained palette, clear hierarchy
- [ ] Quality: Reusable, accessible, consistent, no overflow/errors

### Done When

- [ ] UI, data, and interactions work
- [ ] Responsive across all screen sizes
- [ ] No broken states, overflow, or console errors
- [ ] Accessible and production-ready

## Medicine inventory

### 3.1 Medicine model

- [ ] Medicine model
- [ ] Batch schema
- [ ] Automatic total stock calculation

Done when: Medicine and batch data are stored correctly and stock totals stay consistent.

### 3.2 Medicine API

- [ ] Create medicine
- [ ] Update medicine
- [ ] Delete medicine
- [ ] Search medicines
- [ ] Pagination
- [ ] Filters

Done when: Inventory CRUD, validation, authentication, and business rules work.

### 3.3 Medicine Page

- [ ] Structure: Layout → Sidebar + Header + MainContent
- [ ] Top: 4 Stats — Total, Low Stock, Near Expiry, Expired
- [ ] Bottom: Medicine inventory table — stock, batch, expiry, status, actions
- [ ] UX: Search, filters, pagination, API-ready states
- [ ] Responsive: Desktop/tablet/mobile, no overflow
- [ ] Design: Premium, futuristic, clear hierarchy
- [ ] Quality: Accessible, reusable, consistent, no errors

### Done When

- [ ] All data/actions work
- [ ] Responsive and accessible
- [ ] No broken states or overflow

## Stock bills

### 4.1 Stock bill model

- [ ] StockBill model
- [ ] Bill number generator

Done when: Bills are stored correctly.

### 4.2 Stock bill API

- [ ] Create bill endpoint
- [ ] Add stock automatically
- [ ] Create missing medicine
- [ ] List bills
- [ ] View bill details

Done when: Bills update inventory correctly and operations are atomic.

### 4.3 Stock Management

- [ ] Structure: Layout → Sidebar + Header + MainContent
- [ ] Left: Stock Bills list/history
- [ ] Top: Add Medicine — Name, Price, Expiry, Purchase Date, Supplier + Add
- [ ] Bottom: Added medicines, cost, Bill No. + Submit
- [ ] Business: Submit saves bill and increases stock
- [ ] UX: API-ready, responsive, loading/empty/error states
- [ ] Quality: Accessible, reusable, no errors

### Done When

- [ ] Add medicines and submit bills
- [ ] Stock updates correctly
- [ ] Responsive and error-free

## OPD management

### 5.1 Patient model

- [ ] Patient model
- [ ] Prescription schema
- [ ] Validation rules

Done when: Patient and prescription data are stored correctly.

### 5.2 Patient API

- [ ] Create patient
- [ ] Validate medicine stock
- [ ] Deduct stock
- [ ] List patients
- [ ] Search patients
- [ ] Pagination
- [ ] View patient

Done when: OPD records and stock deduction work end to end.

### 5.3 OPD Page

- [ ] Structure: Layout → Sidebar + Header + MainContent
- [ ] Top: OPD patient form with all required patient/visit fields
- [ ] Bottom: Patient records table displaying all submitted form data
- [ ] Business: Form submission creates a patient/OPD record
- [ ] UX: API-ready, loading/empty/error states, clear feedback
- [ ] Responsive: Desktop/tablet/mobile without overflow
- [ ] Quality: Accessible, reusable, consistent, no errors

### Done When

- [ ] OPD records can be submitted and displayed
- [ ] All form data appears correctly in the table
- [ ] Responsive and error-free

## Expiry management

### 6.1 Expiry API

- [ ] Expired batches endpoint
- [ ] Near-expiry endpoint
- [ ] Scrap endpoint
- [ ] Scrap record creation

Done when: Expiry and scrap workflows work correctly.

### 6.2 Expiry Page

- [ ] Structure: Layout → Sidebar + Header + MainContent
- [ ] Columns: Expired | Near Expiry | Scrapped
- [ ] Actions: Expired medicines can be scrapped
- [ ] Business: Scrapping moves the medicine to Scrapped and removes its stock
- [ ] UX: API-ready, responsive, loading/empty/error states
- [ ] Quality: Accessible, reusable, no errors

### Done When

- [ ] Expired, near-expiry, and scrapped medicines display correctly
- [ ] Expired medicines can be scrapped successfully
- [ ] Responsive and error-free

## Polish and release

### 7.1 UX improvements

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Toast notifications
- [ ] Form feedback

### 7.2 Testing

- [ ] Login flow
- [ ] Protected routes
- [ ] Stock deduction
- [ ] Stock addition
- [ ] Expiry detection
- [ ] Scrap workflow
- [ ] Dashboard statistics

### 7.3 Production readiness

- [ ] Environment review
- [ ] Security review
- [x] Seed admin user
- [ ] Deployment setup

Done when: The application is ready for a production demo.
