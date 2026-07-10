# QA Defect Log & Fix Verification Report

This document records the defects logged during the testing cycles of the News Portal application. It outlines the steps to reproduce, expected vs. actual outcomes, severity/priority classifications, and the regression testing details confirming that the fixes are stable.

---

## 🐛 Active & Closed Defects Summary

| Bug ID | Description | Severity | Priority | Status | Target Release |
|---|---|---|---|---|---|
| **BUG_001** | Profile update endpoint allows duplicate email assignment across users | High | P1 | **VERIFIED FIXED** | v1.1.0 |
| **BUG_002** | Missing Authorization header results in 500 Internal Server Error | Medium | P2 | **VERIFIED FIXED** | v1.1.0 |
| **BUG_003** | News search queries are case-sensitive, blocking matching content | Medium | P2 | **VERIFIED FIXED** | v1.1.0 |

---

## 📝 Detailed Defect Reports

### BUG_001: Profile update allows email duplication
* **Date Logged**: July 07, 2026
* **Reporter**: Junior QA Engineer
* **Component**: Backend Auth Service (`/api/auth/profile`)
* **Environment**: Local Staging (Node.js v18.16.0, MongoDB v7.0)
* **Severity**: High (Data integrity issue) | **Priority**: P1 (Fix immediately)
* **Status**: **VERIFIED FIXED**
* **Steps to Reproduce**:
  1. Register User A with email `userA@example.com`.
  2. Register User B with email `userB@example.com`.
  3. Log in as User B and obtain the JWT token.
  4. Send a PUT request to `/api/auth/profile` using User B's token with the payload:
     ```json
     {
       "email": "userA@example.com"
     }
     ```
* **Expected Result**:
  * The server should reject the request with `400 Bad Request` or `409 Conflict` because the email `userA@example.com` is already registered by another user.
* **Actual Result**:
  * The server responds with `200 OK` and saves the updated email. MongoDB database now contains two distinct user documents with the exact same email field, violating the uniqueness constraint and breaking future logins.
* **Developer Fix**:
  * Implemented a validation hook in `authService.updateProfile` checking if the target email is already claimed by another user:
    ```javascript
    const existing = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
    if (existing) throw new BadRequestError("Email is already in use");
    ```
* **QA Regression / Verification**:
  * Re-ran the steps to reproduce on build `v1.1.0`. The endpoint now correctly blocks the request and returns `400 Bad Request` with `{"message": "Email is already in use"}`. Verification: **PASS**.

---

### BUG_002: Missing Authorization header yields 500 Internal Server Error
* **Date Logged**: July 08, 2026
* **Reporter**: Junior QA Engineer
* **Component**: Authentication Middleware (`/middlewares/auth.js`)
* **Environment**: Local Staging
* **Severity**: Medium (API Contract violation) | **Priority**: P2 (Resolve before release)
* **Status**: **VERIFIED FIXED**
* **Steps to Reproduce**:
  1. Send a GET request to a protected endpoint (e.g. `/api/auth/profile`).
  2. Ensure the `Authorization` header is completely omitted.
* **Expected Result**:
  * HTTP status `401 Unauthorized` with response payload: `{"message": "No token, authorization denied"}`.
* **Actual Result**:
  * HTTP status `500 Internal Server Error` with error stack trace exposed in JSON. The server output console logs: `TypeError: Cannot read properties of undefined (reading 'startsWith')`.
* **Developer Fix**:
  * Fixed null pointer reference check in `auth.js` middleware to handle cases where the header is undefined:
    ```javascript
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    ```
* **QA Regression / Verification**:
  * Re-tested by submitting requests without headers to `/api/auth/profile` and `/api/news` (POST). Responses are now consistently `401 Unauthorized` with the correct JSON error payload. Verification: **PASS**.

---

### BUG_003: News search queries are case-sensitive
* **Date Logged**: July 08, 2026
* **Reporter**: Junior QA Engineer
* **Component**: News Service Search Query Builder (`/services/newsService.js`)
* **Environment**: Local Staging
* **Severity**: Medium (Impaired User Experience) | **Priority**: P2 (Resolve before release)
* **Status**: **VERIFIED FIXED**
* **Steps to Reproduce**:
  1. Create a news article with title "Exploring Sports in 2026".
  2. Send a GET request to `/api/news?search=sports` (all lowercase).
  3. Send a GET request to `/api/news?search=Sports` (proper case).
* **Expected Result**:
  * Both search requests should return the article "Exploring Sports in 2026" because "sports" (lowercase) matches "Sports" (proper case).
* **Actual Result**:
  * The query `search=Sports` successfully returns 1 article.
  * The query `search=sports` returns 0 articles (`total: 0`, empty data array).
* **Developer Fix**:
  * Modified the RegExp query builder inside `getNewsList` in `newsService.js` to include the `"i"` (case-insensitive) regex flag:
    ```javascript
    const searchRegex = new RegExp(search, "i");
    ```
* **QA Regression / Verification**:
  * Sent requests with varying capitalization parameters (`sports`, `SPORTS`, `SpOrTs`). All returned the target article. Verification: **PASS**.
