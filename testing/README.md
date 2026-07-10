# News Portal — QA Documentation & Portfolio

Welcome to the QA Documentation workspace for the **News Portal** project. This documentation showcases the testing strategies, test plans, manual test suites, and API automation collections used to verify the reliability, security, and performance of the News Portal application.

This repository structure has been designed to highlight **basic to intermediate QA testing workflows** suitable for junior-level QA validation, reflecting a solid foundation in software testing lifecycles (STLC).

---

## 📁 QA Folder Directory Structure

```
qa/
├── README.md                              # QA testing strategy and overview (this file)
├── defect_log.md                          # Defect tracking log (reported issues, severity, statuses, fixes verified)
├── test-cases/
│   ├── jwt_auth_test_cases.md             # Manual test cases for JWT authentication and session security
│   └── content_management_test_cases.md   # Manual test cases for CRUD operations on articles and validation rules
└── postman/
    └── News_Portal_API.postman_collection.json # Exported Postman API test collection with test scripts
```

---

## 🎯 Core Testing Focus Areas

### 1. JWT Authentication Flows
Tested the end-to-end authentication mechanisms to ensure only authorized users access private endpoints.
* **Scope**: Registration, Login, Profile Retrieval, and Profile Update.
* **Aspects Verified**: Token generation upon login, header format injection (`Bearer <token>`), missing/invalid/tampered token rejection, expired tokens, and validation error messages (e.g. invalid emails or short passwords).
* **Reference**: [JWT Auth Test Cases](file:///f:/News%20Portal/qa/test-cases/jwt_auth_test_cases.md)

### 2. API Testing on Content Management Endpoints (CRUD)
Conducted API testing on the content endpoints (News Posts and Comments) to validate that data complies with database and validation requirements.
* **Scope**: Create News, Update News, Get All News (with search/pagination/filters), Get News by ID/Slug, and Delete News.
* **Aspects Verified**: Response HTTP status codes (200, 201, 400, 401, 403, 404), schema structure validations, file/image upload attachments, and authorization boundaries (ensuring authors can only edit or delete their own posts).
* **Reference**: [Content Management Test Cases](file:///f:/News%20Portal/qa/test-cases/content_management_test_cases.md)

### 3. Defect Logging & Verification
Documented software errors systematically, verifying that bugs were resolved and regression testing was executed.
* **Scope**: Logging step-by-step reproduction instructions, expected vs. actual outcomes, specifying severity/priority, and closing defects after fixes.
* **Reference**: [Defect Log](file:///f:/News%20Portal/qa/defect_log.md)

### 4. Automated Postman Assertion Testing
Created a Postman Collection containing automated test assertions written in Javascript to verify response behavior in seconds.
* **Features**:
  * **Dynamic Token Handling**: Login scripts dynamically extract the JWT access token and save it to an environment variable, which is automatically injected into the headers of protected requests.
  * **Status Code Verifications**: Ensures every API request yields the expected standard HTTP response code.
  * **Validation Assertions**: Confirms validation error descriptions align with defined backend validation rules.
* **Reference**: [Postman Collection](file:///f:/News%20Portal/qa/postman/News_Portal_API.postman_collection.json)

---

## 🛠️ Testing Environment & Tools
* **Testing Scope**: Backend REST API.
* **Defect Tracking**: GitHub Markdown Defect Log.
* **API Testing Tools**: Postman Desktop Client.
* **Database Verification**: MongoDB compass / Atlas (direct record checking to verify database writes).
