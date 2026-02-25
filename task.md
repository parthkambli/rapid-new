
# 🚨 Admin Dropdown Performance Audit & Refactor Guide

This section documents dropdown components in the Admin section that are currently loading data in bulk (e.g., fetching 1000 records at once). This leads to slow page loads and potential browser crashes as the database grows.

## 🚀 Priority Refactor List

### 1. Sales Bill (`CreateBill.jsx`)
- **File:** `src/pages/Admin/Salesbill/CreateBill.jsx`
- **Issue:** Fetches 1000 doctors in `useEffect`. Using `react-select` for client-side filtering.
- **Complexity:** Medium (Linked to previous sales bill fetching logic).

### 2. Expense Management (`CreateExpense.jsx`)
- **File:** `src/pages/Admin/Expense/CreateExpense.jsx`
- **Issue:** 
    - **Employees:** Uses a `while` loop to fetch ALL employees. **Major Red Flag.**
    - **Advocates/Experts:** Fetches all records when the category is selected.
- **Complexity:** High (Multi-category logic).

### 3. Quotation Creation (`CreateQuotation.jsx`)
- **File:** `src/pages/Admin/Quotation/CreateQuotation.jsx`
- **Issue:** Fetches 1000 doctors in bulk.
- **Complexity:** Low.

### 4. Policy Editing (`EditPolicy.jsx`)
- **File:** `src/pages/Admin/Policy/EditPolicy.jsx`
- **Issue:** Loads 1000 doctors in `fetchDropdownData`.
- **Complexity:** Medium.

### 5. Advocate/Expert Billing
- **Files:** `CreateAdvocateBill.jsx` and `CreateExpertBill.jsx`.
- **Issue:** Fetches 1000 doctors as reference data.

---

## 🛠️ Refactor Blueprint (How to Fix)

Follow the pattern from `AddPolicy.jsx`:

1.  **Debounced Fetch:** Instead of `useEffect` fetch, use a debounced function triggered by `onInputChange`.
2.  **React-Select Config:** Set `filterOption={() => true}` to disable client-side filtering.
3.  **Backend Intersection:** Ensure controller uses `$and` to combine `search` regex with mandatory base filters.

---

## Existing Logs & Reference Data

http://localhost:3000/api/doctors/followups/all?page=1&limit=1000
