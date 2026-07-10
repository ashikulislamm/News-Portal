# Manual Test Cases: User Registration & JWT Authentication Flows

This document details the manual test suite developed to verify the user account lifecycle, validation constraints, and JSON Web Token (JWT) authorization boundaries for the News Portal application.

---

## 🔐 Test Cases Specification

| TC ID & Name | Description | Preconditions | Endpoint | Test Steps | Expected Result | Severity/Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_AUTH_001**<br>Register User with Valid Credentials (Happy Path) | Verify that a user can successfully create an account when providing valid, unique data. | Email address must not be registered in the database. | `POST /api/auth/register` | 1. Prepare JSON payload with valid data.<br>2. Send request. | HTTP `201 Created`.<br>User record correctly stored in DB. | High / P1 | PASS |
| **TC_AUTH_002**<br>Register User with Existing Email (Negative Test) | Verify that the system prevents duplicate registrations using an already registered email. | A user with the email already exists in the database. | `POST /api/auth/register` | 1. Prepare JSON payload with duplicate email.<br>2. Send request. | HTTP `400 Bad Request`.<br>Response: `User already exists`. | High / P1 | PASS |
| **TC_AUTH_003**<br>Register User with Invalid Input Formatting | Verify that validation boundaries are enforced for registration inputs (e.g. short password). | None | `POST /api/auth/register` | 1. Prepare JSON payload with short password/invalid email.<br>2. Send request. | HTTP `400 Bad Request`.<br>Response contains validation error list. | Medium / P2 | PASS |
| **TC_AUTH_004**<br>User Login with Valid Credentials (Happy Path) | Verify that a registered user can log in and receive a valid JWT access token. | User is registered. | `POST /api/auth/login` | 1. Prepare JSON payload with valid credentials.<br>2. Send request. | HTTP `200 OK`.<br>Response contains a valid JWT `token` and `user` object. | Critical / P1 | PASS |
| **TC_AUTH_005**<br>User Login with Invalid Credentials (Negative Test) | Verify that login is denied if the password is incorrect or the email is not registered. | None | `POST /api/auth/login` | 1. Prepare payload with incorrect credentials.<br>2. Send request. | HTTP `400 Bad Request`.<br>Response: `Invalid credentials`. | High / P1 | PASS |
| **TC_AUTH_006**<br>Access Protected Route Without Token | Verify that protected endpoints block access if no token is provided. | None | `GET /api/auth/profile` | 1. Send request without `Authorization` header. | HTTP `401 Unauthorized`.<br>Response: `No token, authorization denied`. | High / P1 | PASS |
| **TC_AUTH_007**<br>Access Protected Route with Invalid Token | Verify that access is denied if the auth token is malformed, modified, or invalid. | None | `GET /api/auth/profile` | 1. Send request with `Bearer invalidToken`. | HTTP `401 Unauthorized`.<br>Response: `Token is not valid`. | High / P1 | PASS |
| **TC_AUTH_008**<br>Get Authenticated User Profile (Happy Path) | Verify that sending a valid token fetches the authenticated user's actual profile details. | Active JWT from login. | `GET /api/auth/profile` | 1. Set `Authorization` header to valid token.<br>2. Send request. | HTTP `200 OK`.<br>Returns user's profile containing `_id`, `fullName`, etc. Password omitted. | Medium / P2 | PASS |
| **TC_AUTH_009**<br>Update Profile with Valid Data (Happy Path) | Verify that an authenticated user can update their own profile fields. | Active JWT from login. | `PUT /api/auth/profile` | 1. Set `Authorization` header.<br>2. Send request with updated fields. | HTTP `200 OK`.<br>Values updated in DB. | Medium / P2 | PASS |
