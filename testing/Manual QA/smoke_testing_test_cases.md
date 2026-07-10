# Manual Test Cases: Smoke Testing

Smoke testing suite for the News Portal for verifying that the most critical functions of the application are working fine before proceeding with deeper testing.

---

## 💨 Smoke Test Cases Specification

| TC ID & Name | Description | Preconditions | Endpoint/Page | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_SMOKE_001**<br>Application Load | Verify that the web application loads successfully on the browser. | Environment is up. | Homepage (`/`) | Homepage loads within acceptable time without 500 errors. | PASS |
| **TC_SMOKE_002**<br>API Health Check | Verify that the backend API is reachable and healthy. | None | `GET /api/health` | Returns HTTP `200 OK` and health status. | PASS |
| **TC_SMOKE_003**<br>User Login | Verify that a registered user can log in to the application. | Test user exists. | `POST /api/auth/login` | Successful login, JWT received, user session active. | PASS |
| **TC_SMOKE_004**<br>Fetch News Feed | Verify that the main news feed is populated with articles. | Database has articles. | `GET /api/news` | List of news articles is returned successfully. | PASS |
| **TC_SMOKE_005**<br>Article View | Verify that a single news article can be viewed. | Known article exists. | `GET /api/news/:slug` | Article content loads without errors. | PASS |
