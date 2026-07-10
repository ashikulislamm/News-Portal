# Manual Test Cases: Content & News CRUD Operations

This document outlines the manual test suite developed to verify article creation, retrieval, modifications, deletion, categorization, and engagement options (likes, view counts) for the News Portal backend API.

---

## 📰 Test Cases Specification

| TC ID & Name | Description | Preconditions | Endpoint | Test Steps | Expected Result | Severity/Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_NEWS_001**<br>Create News Post with Valid Data | Verify authenticated user can create a news post with valid data. | Active JWT. | `POST /api/news` | 1. Set `Authorization` header.<br>2. Send POST with valid JSON/form data. | HTTP `201 Created`.<br>Post stored with generated slug and reading time. | High / P1 | PASS |
| **TC_NEWS_002**<br>Create News Post Missing Fields | Verify backend blocks article creation if required fields are missing. | Active JWT. | `POST /api/news` | 1. Set `Authorization` header.<br>2. Send POST with empty required fields. | HTTP `400 Bad Request`.<br>Response details missing fields. | Medium / P2 | PASS |
| **TC_NEWS_003**<br>Create News Post Invalid Category | Verify category field strictly matches predefined enumerations. | Active JWT. | `POST /api/news` | 1. Set `Authorization` header.<br>2. Send POST with invalid category. | HTTP `400 Bad Request`.<br>Response lists allowed categories. | Medium / P2 | PASS |
| **TC_NEWS_004**<br>Retrieve All News Posts | Verify anyone can fetch the list of news posts. | None | `GET /api/news` | 1. Send GET request without authentication. | HTTP `200 OK`.<br>Returns paginated data array of articles. | High / P1 | PASS |
| **TC_NEWS_005**<br>Search and Filter News Posts | Verify query filter parameters return matching articles. | None | `GET /api/news` | 1. Send GET with filters (`?search=AI`, etc.). | HTTP `200 OK`.<br>Results match filter criteria. | Medium / P2 | PASS |
| **TC_NEWS_006**<br>Retrieve Single News Post | Verify a single post can be fetched and view count increments. | Note current `viewCount`. | `GET /api/news/:idOrSlug` | 1. Send GET using slug or ID. | HTTP `200 OK`.<br>Returns article, view count incremented. | High / P1 | PASS |
| **TC_NEWS_007**<br>Retrieve Non-Existent Post | Verify 404 response for non-existent post slug/ID. | None | `GET /api/news/invalid` | 1. Send GET with invalid slug. | HTTP `404 Not Found`.<br>Response: `Post not found`. | Medium / P2 | PASS |
| **TC_NEWS_008**<br>Update News Post by Owner | Verify author can successfully update their article fields. | Logged in as author. | `PUT /api/news/:id` | 1. Set `Authorization` header.<br>2. Send PUT with update payload. | HTTP `200 OK`.<br>Slug auto-regenerated based on new title. | High / P1 | PASS |
| **TC_NEWS_009**<br>Update News Post by Unauthorized User | Verify a user cannot modify an article created by another user. | Tokens for User A and B. | `PUT /api/news/:id` | 1. Set `Authorization` for User B.<br>2. Send PUT to update User A's post. | HTTP `403 Forbidden`.<br>Response: `Unauthorized`. | High / P1 | PASS |
| **TC_NEWS_010**<br>Toggle Like State on Article | Verify authenticated users can toggle their like status. | Active JWT. | `POST /api/news/:id/like` | 1. Send POST to like.<br>2. Send POST again to unlike. | First Like: `200 OK`, `likesCount` +1.<br>Unlike: `200 OK`, `likesCount` -1. | Low / P3 | PASS |
| **TC_NEWS_011**<br>Delete News Post and Cascade | Verify author can delete their post and associated comments cascade. | Active JWT of author. | `DELETE /api/news/:id` | 1. Set `Authorization` header.<br>2. Send DELETE. | HTTP `200 OK`.<br>Post and comments deleted from DB. | High / P1 | PASS |
