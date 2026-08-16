# AGENTS.md

## Project

Clinic OPD Management System (MERN)

Stack:

* React + Vite
* Tailwind CSS
* Node.js + Express
* MongoDB + Mongoose
* JWT + HTTP-only Cookies

---

## Rules

1. Read SPEC.md before coding.
2. Follow existing patterns.
3. Keep solutions simple.
4. Do not add libraries unless necessary.
5. Do not use TypeScript.
6. Do not use Redux.
7. Use Tailwind only.

---

## Backend Standards

* Use async/await.
* Validate all inputs.
* Return proper HTTP status codes.
* Use centralized error handling.
* Keep business logic out of routes.

---

## Frontend Standards

* Functional components only.
* Reusable components when possible.
* Loading, error and empty states required.
* Mobile responsive layouts.

---

## Critical Business Rules

Patient Creation:

* Validate stock.
* Deduct stock from selected batch.
* Reject if stock insufficient.

Stock Bill Creation:

* Add stock automatically.
* Create medicine if missing.
* Recalculate total stock.

Expiry Management:

* Detect expired batches automatically.
* Scrap creates ScrapRecord.
* Scrap sets stock to 0.

Never bypass these rules.

---

## Before Every Task

1. Read relevant section of SPEC.md.
2. Explain implementation plan.
3. Implement.
4. Verify against SPEC.md.
5. Report changed files.

---

## Definition Of Done

✓ Feature works

✓ Validation works

✓ No console errors

✓ No server errors

✓ Responsive UI

✓ Matches SPEC.md
